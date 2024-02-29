'use strict';

const db = require('../database');
const plugins = require('../plugins');

module.exports = function (Posts) {
    Posts.endorsement = async function (pid, uid) {
        return await toggleEndorsement('endorsement', pid, uid);
    };

    Posts.unendorsement = async function (pid, uid) {
        return await toggleUnendorsement('unendorsement', pid, uid);
    };

    async function toggleEndorsement(type, pid, uid) {
        if (parseInt(uid, 10) <= 0) {
            throw new Error('[[error:not-logged-in]]');
        }

        const isEndorsed = await Posts.getPostField(pid, 'endorsements');

        if(isEndorsed === 1){
            throw new Error('[[error:already-endorsed]]');
        }

        await db.setObjectField(`post:${pid}`, 'endorsements', 1);

        // get the username and put a checkmark next to the user if the post has been endorsed
        const username = await db.getObjectField(`user:${uid}`, 'username');
        await db.setObjectField(`post:${pid}`, `endorsement:${username}`, 'endorsed');

        plugins.hooks.fire(`action:post.${type}`, {
            pid: pid,
            uid: uid,
            owner: postData.uid,
            current: 'endorsed',
        });

        return {
            post: postData,
            isEndorsed: true,
        };

    }




    // async function toggleendorsement(type, pid, uid) {
    //     if (parseInt(uid, 10) <= 0) {
    //         throw new Error('[[error:not-logged-in]]');
    //     }

    //     const isendorsementing = type === 'endorsement';

    //     const [postData, hasendorsemented] = await Promise.all([
    //         Posts.getPostFields(pid, ['pid', 'uid']),
    //         Posts.hasendorsemented(pid, uid),
    //     ]);

    //     if (isendorsementing && hasendorsemented) {
    //         throw new Error('[[error:already-endorsemented]]');
    //     }

    //     if (!isendorsementing && !hasendorsemented) {
    //         throw new Error('[[error:already-unendorsemented]]');
    //     }

    //     if (isendorsementing) {
    //         await db.sortedSetAdd(`uid:${uid}:endorsements`, Date.now(), pid);
    //     } else {
    //         await db.sortedSetRemove(`uid:${uid}:endorsements`, pid);
    //     }
    //     await db[isendorsementing ? 'setAdd' : 'setRemove'](`pid:${pid}:users_endorsemented`, uid);
    //     postData.endorsements = await db.setCount(`pid:${pid}:users_endorsemented`);
    //     await Posts.setPostField(pid, 'endorsements', postData.endorsements);

    //     plugins.hooks.fire(`action:post.${type}`, {
    //         pid: pid,
    //         uid: uid,
    //         owner: postData.uid,
    //         current: hasendorsemented ? 'endorsemented' : 'unendorsemented',
    //     });

    //     return {
    //         post: postData,
    //         isendorsemented: isendorsementing,
    //     };
    // }

    Posts.hasendorsemented = async function (pid, uid) {
        if (parseInt(uid, 10) <= 0) {
            return Array.isArray(pid) ? pid.map(() => false) : false;
        }

        if (Array.isArray(pid)) {
            const sets = pid.map(pid => `pid:${pid}:users_endorsemented`);
            return await db.isMemberOfSets(sets, uid);
        }
        return await db.isSetMember(`pid:${pid}:users_endorsemented`, uid);
    };
};
// 'use strict';

// const db = require('../database');
// const plugins = require('../plugins');

// module.exports = function (Posts) {
//     Posts.endorsement = async function (pid, uid) {
//         return await toggleEndorsement('endorsement', pid, uid);
//     };

//     Posts.unendorsement = async function (pid, uid) {
//         return await toggleEndorsement('unendorsement', pid, uid);
//     };

//     async function toggleEndorsement(type, pid, uid) {
//         if (parseInt(uid, 10) <= 0) {
//             throw new Error('[[error:not-logged-in]]');
//         }

//         const isEndorsed = await Posts.getPostField(pid, 'endorsements');

//         if (isEndorsed) {
//             throw new Error('[[error:already-endorsed]]');
//         }

//         await db.setObjectField(`post:${pid}`, 'endorsements', 1);

//         // Fire a hook to perform any additional actions on endorsement
//         plugins.hooks.fire(`action:post.${type}`, {
//             pid: pid,
//             uid: uid,
//             current: 'endorsed',
//         });

//         return {
//             isEndorsed: true,
//         };
//     }

//     Posts.hasEndorsed = async function (pid, uid) {
//         if (parseInt(uid, 10) <= 0) {
//             return false;
//         }

//         const isEndorsed = await Posts.getPostField(pid, 'endorsements');

//         return !!isEndorsed;
//     };
// };
