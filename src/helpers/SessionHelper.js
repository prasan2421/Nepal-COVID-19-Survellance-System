// import AsyncStorage from '@react-native-community/async-storage';
import {

	AsyncStorage,

} from 'react-native';
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
	saveNotificationSeenTime: (notificationSeenTime) => {
		return AsyncStorage.setItem('notificationSeenTime', emptyStringIfNull(notificationSeenTime));
	},
	getNotificationSeenTime: () => {
		return AsyncStorage.getItem('notificationSeenTime');
	},
	saveNotificationCount: (notificationCount) => {
		return AsyncStorage.setItem('notificationCount', emptyStringIfNull(notificationCount));
	},
	getNotificationCount: () => {
		return AsyncStorage.getItem('notificationCount');
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
	saveAboutHtml: (aboutHtml) => {
		return AsyncStorage.setItem('aboutHtml', emptyStringIfNull(aboutHtml));
	},
	getAboutHtml: () => {
		return AsyncStorage.getItem('aboutHtml');
	},
	saveFAQsHtml: (faqsHtml) => {
		return AsyncStorage.setItem('faqsHtml', emptyStringIfNull(faqsHtml));
	},
	getFAQsHtml: () => {
		return AsyncStorage.getItem('faqsHtml');
	},
	saveCartJson: (cartJson) => {
		return AsyncStorage.setItem('cartJson', emptyStringIfNull(cartJson));
	},
	getCartJson: () => {
		return AsyncStorage.getItem('cartJson');
	},
	removeCartJson: () => {
		return AsyncStorage.removeItem('cartJson');
	},
	removeAll: () => {
		return AsyncStorage.clear();
	}
};