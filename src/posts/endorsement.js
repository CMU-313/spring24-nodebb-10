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
        const [postData, hasBookmarked] = await Promise.all([
            Posts.getPostFields(pid, ['pid', 'uid']),
            Posts.hasBookmarked(pid, uid),
        ]);

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
