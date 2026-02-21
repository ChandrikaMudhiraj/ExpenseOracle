from typing import List, Dict
from collections import Counter

class SmartSuggestions:
    """
    Context-aware suggestion engine based on user spending patterns.
    Adds a 'Lifestyle Optimization' layer to the autonomous system.
    """

    @classmethod
    def analyze_patterns(cls, expenses: List[Dict]) -> List[Dict]:
        """
        Analyzes transaction patterns to generate smart lifestyle suggestions.
        """
        suggestions = []
        
        # 1. Frequency Analysis (e.g., Subscriptions or habits)
        titles = [e['title'].lower() for e in expenses]
        merchant_counts = Counter(titles)
        
        for merchant, count in merchant_counts.items():
            if count >= 4:  # High frequency
                if any(k in merchant for k in ["uber", "ola", "transport"]):
                    suggestions.append({
                        "category": "Transportation",
                        "insight": f"You used {merchant.title()} {count} times this month.",
                        "suggestion": "Consider a monthly transport pass to save up to 20% on commute costs."
                    })
                elif any(k in merchant for k in ["starbucks", "coffee", "cafe"]):
                    suggestions.append({
                        "category": "Lifestyle",
                        "insight": f"Frequent coffee visits detected ({count} times).",
                        "suggestion": "Using a reusable cup or a loyalty card could save you $15/month."
                    })

        # 2. Category Concentration
        categories = [e.get('category') for e in expenses if e.get('category')]
        cat_counts = Counter(categories)
        total_expenses = len(expenses)
        
        for cat, count in cat_counts.items():
            if count / total_expenses > 0.4:  # 40% of transactions in one category
                suggestions.append({
                    "category": cat,
                    "insight": f"Over 40% of your transactions are in '{cat}'.",
                    "suggestion": f"Your spending is highly concentrated. We suggest diversifying your budget to ensure essential needs are met."
                })

        return suggestions
