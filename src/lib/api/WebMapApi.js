import esriId from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import Portal from "@arcgis/core/portal/Portal";
import Extent from "@arcgis/core/geometry/Extent";
import PortalItem from "@arcgis/core/portal/PortalItem";
import WebMap from "@arcgis/core/WebMap";

const portalAccess = "org";
const key = "esriJSAPIOAuth";

export function signIn(appId, portalUrl) {
	const info = new OAuthInfo({
		appId: appId,
		portalUrl: portalUrl,
		flowType: "auto",
		popup: false,
	});
	esriId.registerOAuthInfos([info]);
	esriId
		.getCredential(info.portalUrl + "/sharing", {
			oAuthPopupConfirmation: false,
		})
		.then((response) => {
			storePortalLocalStorage(response);
			handleSignedInEnterprise(portalUrl, portalAccess, null, null);
		})
		.catch(() => {
			console.log("Crap");
		});
}

export function getLayersByWebMapId(portalUrl, webMapId) {
	const portalItem = new PortalItem({
		id: webMapId,
		portal: new Portal({
			url: portalUrl,
		}),
	});

	const webmap = new WebMap({
		portalItem: portalItem,
	});
	return portalItem.load().then(() => {
		return webmap.load().then(() => {
			let layers = webmap.layers;
			let layerDefs = layers.map((layer) => {
				return { id: layer.id, title: layer.title, on: layer.visible, opacity: layer.opacity, url: layer.url, popup: layer.popupEnabled, type: layer.type };
			});
			let portalItemTags = portalItem.tags;
			return {
				webMap: webmap,
				portalItem: portalItem,
				webMapLayers: layerDefs.items,
				tags: portalItemTags,
				extent: new Extent({
					xmin: -13890920.902815674,
					ymin: 2285814.854268067,
					xmax: -7365033.175942202,
					ymax: 6791319.049508298,
					spatialReference: {
						wkid: 102100,
					},
				}),
				filter:[],
				attributeTableLayers:[]
			};
		});
	});
}

function storePortalLocalStorage(result, cb) {
	if (window && window.sessionStorage) {
		const oauth = window.sessionStorage.getItem(key);
		if (!result && !oauth) {
			return;
		}
		const oauthObj = JSON.parse(oauth);

		if (window.localStorage && !result) {
			const localStorageoAuths = window.localStorage.getItem(key);
			if (!localStorageoAuths) {
				window.localStorage.setItem(key, JSON.stringify(oauthObj));
				window.sessionStorage.removeItem(key);
				return;
			}
			const lsAuth = JSON.parse(localStorageoAuths);
			lsAuth["/"] = {
				...lsAuth["/"],
				...oauthObj["/"],
			};
			window.localStorage.setItem(key, JSON.stringify(lsAuth));
			window.sessionStorage.removeItem(key);
		}

		if (cb != null && typeof cb === "function") {
			cb();
		}
	}
}

function handleSignedInEnterprise(url, access, search, cb) {
	let portal = new Portal({
		url: url,
	});
	portal.authMode = "immediate";
	portal
		.load()
		.then(() => {})
		.catch((error) => {
			console.error("Error occurred while signing in: ", error);
		});
}
