import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';

admin.initializeApp()

export const FeedGetir=functions.https.onCall(async (req,res)=>{

    const collection=await admin.firestore().collection('posts').limit(10).get()

    return collection.docs.map(doc=>{
        return {
            postID:doc.id,
            ...doc.data()
        }
    })
})
