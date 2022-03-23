const { Post } = require('../models');

const postData = [
    {
        title: "Harvey Dent!",
        post_content: "The Night Is Darkest Right Before The Dawn. And I Promise You, The Dawn Is Coming.",
        user_id: 3
    },
    {
        title: "Friends!",
        post_content: "HAH!!!! Banana is too tiny!!!",
        user_id: 1
    },
    {
        title: "Sun Wukong!",
        post_content: "This is my real name mate ^^",
        user_id: 2

    },
    {
        title: "Am I?",
        post_content: "I have no idea that we “talk just like humans”, according to this article https://www.theguardian.com/commentisfree/2019/feb/14/chimpanzees-talk-humans-gestures-language",
        user_id: 5
    },
    {
        title: "Why so serious?",
        post_content: "“Costume’s a bit theatrical, but hey, who am I to talk?” — Batman: Mask of the Phantasm",
        user_id: 4
    }
]

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;