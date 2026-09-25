const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// DJ-specific item IDs and their notification content
const DJ_ITEMS = {
    djCountyClerk: {
        title: '📱 DALLAS COUNTY CLERK\'S OFFICE',
        body: 'Jim came through. The original 1902 filing is in.'
    },
    djCoroner: {
        title: '📱 DALLAS COUNTY CORONER',
        body: 'Frank sent over the preliminary autopsy. Find someone with medical training.'
    },
    djPinkerton: {
        title: '📱 PINKERTON DETECTIVE AGENCY',
        body: 'Background checks complete. Two names flagged. Read carefully.'
    }
};

// Watch activeItems in Realtime Database
// Fires when Scott presses a "Send Text to DJ" button
exports.sendDJNotification = functions.database.ref('/activeItems')
    .onWrite(async (change, context) => {
        const before = change.before.val() || [];
        const after  = change.after.val()  || [];

        // Find items that were just added and are DJ-specific
        const newDJItems = after.filter(function(id) {
            return !before.includes(id) && DJ_ITEMS[id];
        });

        if (newDJItems.length === 0) return null;

        // Load DJ's registered FCM tokens from database
        const tokensSnap = await admin.database().ref('fcmTokens/DJ').once('value');
        const tokensObj = tokensSnap.val();
        if (!tokensObj) {
            console.log('No FCM tokens found for DJ');
            return null;
        }

        // Tokens are stored as { shortKey: fullToken }
        const tokens = Object.values(tokensObj);
        if (tokens.length === 0) return null;

        for (const itemId of newDJItems) {
            const notif = DJ_ITEMS[itemId];
            console.log('Sending FCM for', itemId, 'to', tokens.length, 'token(s)');

            const response = await admin.messaging().sendEachForMulticast({
                tokens: tokens,
                notification: {
                    title: notif.title,
                    body: notif.body
                },
                webpush: {
                    notification: {
                        title: notif.title,
                        body: notif.body,
                        icon: 'https://thoreson-estate.web.app/icon-192.png',
                        badge: 'https://thoreson-estate.web.app/icon-192.png',
                        renotify: true,
                        tag: 'thoreson-dj'
                    },
                    fcmOptions: {
                        link: 'https://thoreson-estate.web.app/authenticated-dashboard.html'
                    }
                }
            });

            // Clean up any invalid tokens
            response.responses.forEach(function(resp, idx) {
                if (!resp.success) {
                    var errCode = resp.error && resp.error.code;
                    if (errCode === 'messaging/invalid-registration-token' ||
                        errCode === 'messaging/registration-token-not-registered') {
                        var badToken = tokens[idx];
                        admin.database().ref('fcmTokens/DJ/' + badToken.substring(0, 20)).remove();
                        console.log('Removed stale token');
                    }
                }
            });
        }

        return null;
    });
