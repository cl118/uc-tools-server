const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const Post = require('../models/Post');

// @route GET api/posts
// @desc Get posts
// @access Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate('user', [
      'username',
    ]).sort({ _id: -1 });
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/', verifyToken, async (req, res) => {
  const { bedNumber, forEdProvider, providerName, providerGroup, status, notes } =
    req.body;

  // Simple validation
  if (!bedNumber)
    return res
      .status(400)
      .json({ success: false, message: 'Bed number is required' });

  if (!forEdProvider)
    return res
      .status(400)
      .json({ success: false, message: 'ED Provider name is required' });

  if (!providerName)
    return res
      .status(400)
      .json({ success: false, message: 'Provider name is required' });

  if (!providerGroup)
    return res
      .status(400)
      .json({ success: false, message: 'Provider group is required' });

  try {
    const newPost = new Post({
      bedNumber,
      forEdProvider,
      providerName,
      providerGroup,
      status: status || 'Paged',
      notes,
      user: req.userId,
    });

    await newPost.save();

    res.json({
      success: true,
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// @route PUT api/posts
// @desc Update post
// @access Private
router.put('/:id', verifyToken, async (req, res) => {
  const { bedNumber, forEdProvider, providerName, providerGroup, status, notes } =
    req.body;

  // Simple validation
  if (!bedNumber)
    return res
      .status(400)
      .json({ success: false, message: 'Bed number is required' });

  if (!forEdProvider)
    return res
      .status(400)
      .json({ success: false, message: 'ED Provider name is required' });

  if (!providerName)
    return res
      .status(400)
      .json({ success: false, message: 'Provider name is required' });

  if (!providerGroup)
    return res
      .status(400)
      .json({ success: false, message: 'Provider group is required' });

  try {
    let updatedPost = {
      bedNumber,
      forEdProvider,
      providerName,
      providerGroup,
      status: status || 'Paged',
      notes,
      user: req.userId,
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedPost = await Post.findOneAndUpdate(
      postUpdateCondition,
      updatedPost,
      { new: true }
    );

    // User not authorized to update post or post not found
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: 'Post not found or user not authorized',
      });

    res.json({ success: true, message: 'Post updated', post: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

    // User not authorized or post not found
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: 'Post not found or user not authorized',
      });

    res.json({
      success: true,
      message: 'Post deleted successfully',
      post: deletedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;