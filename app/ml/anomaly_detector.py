from typing import List, Dict
import numpy as np
import math

class AnomalyDetector:
    """
    Detects unusual financial transactions using statistical Z-Score.
    This is vital for security and identifying budget leaks.
    """
    
    @classmethod
    def detect_anomalies(cls, expenses: List[Dict], threshold: float = 2.0) -> List[Dict]:
        """
        Detects anomalies by comparing each transaction to its SPECIFIC merchant baseline.
        If a merchant has only 1 transaction, it falls back to global category stats.
        """
        if not expenses:
            return []

        # 1. Group by Merchant (Title)
        merchant_history = {}
        for exp in expenses:
            title = exp['title'].lower()
            if title not in merchant_history:
                merchant_history[title] = []
            merchant_history[title].append(exp['amount'])

        anomalies = []
        
        # 2. Global statistics (Fallback)
        all_amounts = [e['amount'] for e in expenses]
        global_mean = np.mean(all_amounts)
        global_std = np.std(all_amounts) if len(all_amounts) > 1 else global_mean * 0.5

        for exp in expenses:
            title = exp['title'].lower()
            history = merchant_history[title]
            
            # 3. Robust Z-Score Calculation (Median & MAD)
            # This is production-grade because it's not polluted by the outliers themselves
            if len(history) >= 2:
                median = np.median(history)
                mad = np.median([abs(x - median) for x in history])
                
                # Default scale for normal distribution (1.4826)
                consistency_constant = 1.4826
                # Avoid division by zero
                mad = max(mad, median * 0.02) 
                
                robust_z_score = abs(exp['amount'] - median) / (consistency_constant * mad)
                z_score = robust_z_score
                reason = f"Spending on '{exp['title']}' is {round(z_score, 1)}x robust-STDs above its median."
            else:
                # Fallback to Global stats
                z_score = abs(exp['amount'] - global_mean) / global_std
                reason = f"Unusual amount for a new merchant. Spending is {round(z_score, 1)}x above your global average."

            if z_score > threshold:
                anomalies.append({
                    "expense_id": exp.get('id'),
                    "title": exp['title'],
                    "amount": exp['amount'],
                    "z_score": round(z_score, 2),
                    "reason": reason
                })

        return anomalies
