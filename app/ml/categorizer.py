import re
from typing import Optional

class MerchantCategorizer:
    """
    ML-ready Merchant Categorizer.
    Initial implementation uses pattern matching, but structured to support 
    embedding-based classification (e.g., using SentenceTransformers) in the future.
    """
    
    CATEGORY_MAPPING = {
        "Food & Dining": [r"zomato", r"swiggy", r"starbucks", r"mcdonalds", r"restaurant", r"cafe", r"uber eats", r"dinner", r"lunch"],
        "Transportation": [r"uber", r"ola", r"petrol", r"fuel", r"metro", r"bus", r"train", r"flight", r"indigo", r"air india"],
        "Shopping": [r"amazon", r"flipkart", r"myntra", r"clothed", r"mall", r"retail", r"grocery", r"bigbasket", r"blinkit"],
        "Utilities": [r"electricity", r"water", r"bescom", r"bill", r"recharge", r"airtel", r"jio", r"vi", r"wifi", r"broadband"],
        "Entertainment": [r"netflix", r"hotstar", r"prime video", r"movie", r"pvr", r"theatre", r"gaming", r"spotify"],
        "Health": [r"hospital", r"pharmacy", r"doctor", r"apollo", r"medplus", r"gym", r"fitness"],
        "Investment": [r"zerodha", r"groww", r"mutual fund", r"sip", r"stock", r"crypto", r"binance"],
    }

    @classmethod
    def categorize(cls, title: str) -> str:
        """
        Categorizes an expense title into a predefined financial category.
        """
        title_lower = title.lower()
        
        for category, patterns in cls.CATEGORY_MAPPING.items():
            for pattern in patterns:
                if re.search(pattern, title_lower):
                    return category
        
        return "Miscellaneous"

# Example Usage
# print(MerchantCategorizer.categorize("Zomato order for dinner")) -> Food & Dining
