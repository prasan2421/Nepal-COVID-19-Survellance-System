import { AsyncStorage } from 'react-native';

emptyStringIfNull = (str) => {
	return str ? str : '';
}

export default {
	saveRegistrationDetails: (email, mobileNumber, firstName, lastName, dateOfBirth, district, address, sex, memberId, qrCodePath, token) => {
		return AsyncStorage.multiSet([
			['email', emptyStringIfNull(email)],
			['mobileNumber', emptyStringIfNull(mobileNumber)],
			['firstName', emptyStringIfNull(firstName)],
			['lastName', emptyStringIfNull(lastName)],
			['dateOfBirth', emptyStringIfNull(dateOfBirth)],
			['district', emptyStringIfNull(district)],
			['address', emptyStringIfNull(address)],
			['sex', emptyStringIfNull(sex)],
			['memberId', emptyStringIfNull(memberId)],
			['qrCodePath', emptyStringIfNull(qrCodePath)],
			['token', emptyStringIfNull(token)]
		]);
	},
	getRegistrationDetails: () => {
		return new Promise((resolve, reject) => {
			AsyncStorage.multiGet(['email', 'mobileNumber', 'firstName', 'lastName', 'dateOfBirth', 'district', 'address', 'sex', 'memberId', 'qrCodePath', 'token'])
			.then(values => {
				let registrationDetails = {};

				for(let value of values) {
					registrationDetails[value[0]] = value[1];
				}
				
				resolve(registrationDetails);
			})
			.catch(error => {
				reject(error);
			})
		});
	},
	setTokenAndMemberId: (token, memberId) => {
		return AsyncStorage.multiSet([
			['token', emptyStringIfNull(token)],
			['memberId', emptyStringIfNull(memberId)]
		]);
	},
	setTokenMemberIdAndQrCodePath: (token, memberId, qrCodePath) => {
		return AsyncStorage.multiSet([
			['token', emptyStringIfNull(token)],
			['memberId', emptyStringIfNull(memberId)],
			['qrCodePath', emptyStringIfNull(qrCodePath)]
		]);
	},
	getToken: () => {
		return AsyncStorage.getItem('token');
	},
	removeToken: () => {
		return AsyncStorage.removeItem('token');
	},
	saveAdsJson: (adsJson) => {
		return AsyncStorage.setItem('adsJson', emptyStringIfNull(adsJson));
	},
	getAdsJson: () => {
		return AsyncStorage.getItem('adsJson');
	},
	savePromotionsJson: (promotionsJson) => {
		return AsyncStorage.setItem('promotionsJson', emptyStringIfNull(promotionsJson));
	},
	getPromotionsJson: () => {
		return AsyncStorage.getItem('promotionsJson');
	},
	savePurchasesJson: (purchasesJson) => {
		return AsyncStorage.setItem('purchasesJson', emptyStringIfNull(purchasesJson));
	},
	getPurchasesJson: () => {
		return AsyncStorage.getItem('purchasesJson');
	},
	savePurchaseItemsJson: (purchaseItemsJson, id) => {
		return AsyncStorage.setItem('purchaseItemsJson' + id, emptyStringIfNull(purchaseItemsJson));
	},
	getPurchaseItemsJson: (id) => {
		return AsyncStorage.getItem('purchaseItemsJson' + id);
	},
	savePointsOverviewJson: (pointsOverviewJson) => {
		return AsyncStorage.setItem('pointsOverviewJson', emptyStringIfNull(pointsOverviewJson));
	},
	getPointsOverviewJson: () => {
		return AsyncStorage.getItem('pointsOverviewJson');
	},
	removePointsOverviewJson: () => {
		return AsyncStorage.removeItem('pointsOverviewJson');
	},
	savePointsJson: (pointsJson) => {
		return AsyncStorage.setItem('pointsJson', emptyStringIfNull(pointsJson));
	},
	getPointsJson: () => {
		return AsyncStorage.getItem('pointsJson');
	},
	saveCouponsJson: (couponsJson) => {
		return AsyncStorage.setItem('couponsJson', emptyStringIfNull(couponsJson));
	},
	getCouponsJson: () => {
		return AsyncStorage.getItem('couponsJson');
	},
	saveGiftCardsJson: (giftCardsJson) => {
		return AsyncStorage.setItem('giftCardsJson', emptyStringIfNull(giftCardsJson));
	},
	getGiftCardsJson: () => {
		return AsyncStorage.getItem('giftCardsJson');
	},
	saveBranchesJson: (branchesJson) => {
		return AsyncStorage.setItem('branchesJson', emptyStringIfNull(branchesJson));
	},
	getBranchesJson: () => {
		return AsyncStorage.getItem('branchesJson');
	},
	saveInquiriesJson: (inquiriesJson) => {
		return AsyncStorage.setItem('inquiriesJson', emptyStringIfNull(inquiriesJson));
	},
	getInquiriesJson: () => {
		return AsyncStorage.getItem('inquiriesJson');
	},
	saveContactDetailsJson: (contactDetailsJson) => {
		return AsyncStorage.setItem('contactDetailsJson', emptyStringIfNull(contactDetailsJson));
	},
	getContactDetailsJson: () => {
		return AsyncStorage.getItem('contactDetailsJson');
	},
	savePricesJson: (pricesJson) => {
		return AsyncStorage.setItem('pricesJson', emptyStringIfNull(pricesJson));
	},
	getPricesJson: () => {
		return AsyncStorage.getItem('pricesJson');
	},
	saveNotificationsJson: (notificationsJson) => {
		return AsyncStorage.setItem('notificationsJson', emptyStringIfNull(notificationsJson));
	},
	getNotificationsJson: () => {
		return AsyncStorage.getItem('notificationsJson');
	},
	saveCompanyProfileHtml: (companyProfileHtml) => {
		return AsyncStorage.setItem('companyProfileHtml', emptyStringIfNull(companyProfileHtml));
	},
	getCompanyProfileHtml: () => {
		return AsyncStorage.getItem('companyProfileHtml');
	},
	saveCartJson: (cartJson) => {
		return AsyncStorage.setItem('cartJson', emptyStringIfNull(cartJson));
	},

    saveCartJsonInvoice: (OrderId,cartJson) => {
        return AsyncStorage.setItem(
                'cartJson' + OrderId, emptyStringIfNull(cartJson)
        	);
    },
    saveCartJsonEditOrder: (OrderId,cartJson) => {
        return AsyncStorage.setItem(
            'cartJson' + OrderId, emptyStringIfNull(cartJson)
        );
    },
    getCartJsonInvoice: (OrderId) => {
        return AsyncStorage.getItem('cartJson' + OrderId);
    },
    getCartJsonEditOrder: (OrderId) => {
        return AsyncStorage.getItem('cartJson' + OrderId);
    },
	getCartJson: () => {
		return AsyncStorage.getItem('cartJson');
	},

    saveCartJsonOffline: (cartJsonOffline) => {
        return AsyncStorage.setItem('cartJsonOffline', emptyStringIfNull(cartJsonOffline));
    },
    getCartJsonOffline: () => {
        return AsyncStorage.getItem('cartJsonOffline');
    },
	removeCartJson: () => {
		return AsyncStorage.removeItem('cartJson');
	},
    removeCartJsonEditOrder: (OrderId) => {
        return AsyncStorage.removeItem('cartJson'+OrderId);
    },
    removeCartOfflineJson: () => {
        return AsyncStorage.removeItem('cartJsonOffline');
    },
	removeAll: () => {
		return AsyncStorage.clear();
	}
};