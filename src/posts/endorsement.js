'use strict';

const plugins = require('../plugins');

module.exports = function (Posts) {
    Posts.endorse = async function (pid, uid) {
        return await toggleEndorsement('endorse', pid, uid);
    };

    Posts.unendorse = async function (pid, uid) {
        return await toggleEndorsement('unendorse', pid, uid);
    };

    async function toggleEndorsement(type, pid, uid) {

        if (parseInt(uid, 10) <= 0) {
            throw new Error('[[error:not-logged-in]]');
        }

        const isEndorsing = true;

        const [postData] = await Promise.all([
            Posts.getPostFields(pid, ['pid', 'uid']),
        ]);

        await Posts.setPostField(pid, 'endorsed', 1);

        plugins.hooks.fire(`action:post.endorse`, {
            pid: pid,
            uid: uid,
            owner: postData.uid,
            current: 'endorsed',
        });

        return {
            post: postData,
            isEndorsed: isEndorsing,
        };
    }
};