"""
docLove - Service de Tarification et d'Abonnement
Offre gratuite jusqu'à 25 pages par document.
Au-delà de 25 pages : Abonnement mensuel à 8 € / mois permettant de traduire jusqu'à 2 000 pages par mois.
Moyens de paiement prêts : Wave Sénégal, Orange Money, Carte Bancaire.
"""
from typing import Dict, Any
from ..config import (
    FREE_TIER_MAX_PAGES,
    SUBSCRIPTION_MONTHLY_PRICE_EUR,
    SUBSCRIPTION_MONTHLY_PRICE_XOF,
    SUBSCRIPTION_MONTHLY_MAX_PAGES,
)

class PricingService:
    @staticmethod
    def calculate_quote(page_count: int, is_subscribed: bool = False) -> Dict[str, Any]:
        """Calcule le tarif et le statut d'abonnement selon le nombre réel de pages."""
        if page_count <= FREE_TIER_MAX_PAGES or is_subscribed:
            return {
                "page_count": page_count,
                "tier": "free" if not is_subscribed else "subscription_active",
                "tier_name": "Offre Gratuite docLove" if not is_subscribed else "Abonnement Pro Actif",
                "price_eur": 0.0,
                "price_xof": 0,
                "is_payable": False,
                "max_pages_allowed": FREE_TIER_MAX_PAGES if not is_subscribed else SUBSCRIPTION_MONTHLY_MAX_PAGES,
                "message": (
                    f"Inclus dans l'offre gratuite (jusqu'à {FREE_TIER_MAX_PAGES} pages par document sans frais)."
                    if not is_subscribed
                    else f"Inclus dans votre Abonnement Pro Mensuel (jusqu'à {SUBSCRIPTION_MONTHLY_MAX_PAGES} pages par mois)."
                )
            }
        else:
            return {
                "page_count": page_count,
                "tier": "subscription",
                "tier_name": "Abonnement Mensuel docLove Pro",
                "price_eur": SUBSCRIPTION_MONTHLY_PRICE_EUR,
                "price_xof": SUBSCRIPTION_MONTHLY_PRICE_XOF,
                "is_payable": True,
                "max_pages_allowed": SUBSCRIPTION_MONTHLY_MAX_PAGES,
                "subscription_monthly_pages": SUBSCRIPTION_MONTHLY_MAX_PAGES,
                "message": (
                    f"Ce document contient {page_count} pages, ce qui dépasse le plafond gratuit ({FREE_TIER_MAX_PAGES} pages). "
                    f"Souscrivez à l'Abonnement Mensuel docLove à {SUBSCRIPTION_MONTHLY_PRICE_EUR:.0f} € / mois (~{SUBSCRIPTION_MONTHLY_PRICE_XOF} FCFA) "
                    f"pour traduire jusqu'à {SUBSCRIPTION_MONTHLY_MAX_PAGES} pages par mois."
                )
            }

    @staticmethod
    def get_supported_payment_gateways_senegal() -> list:
        """Passerelles de paiement supportées."""
        return [
            {
                "id": "wave_sn",
                "name": "Wave Sénégal",
                "type": "mobile_money",
                "currency": "XOF",
                "status": "ready",
                "description": "Règlement instantané 8 € (~5 250 FCFA/mois) via compte Wave."
            },
            {
                "id": "orange_money_sn",
                "name": "Orange Money Sénégal",
                "type": "mobile_money",
                "currency": "XOF",
                "status": "ready",
                "description": "Prélèvement mobile OM instantané et sécurisé par code OTP."
            },
            {
                "id": "card",
                "name": "Carte Bancaire (Visa / Mastercard)",
                "type": "card",
                "currency": "EUR",
                "status": "ready",
                "description": "Paiement international par carte bancaire 8 €/mois sans engagement."
            }
        ]
