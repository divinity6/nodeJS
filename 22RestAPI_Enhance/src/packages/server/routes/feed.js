const express = require( 'express' );
const { body } = require( 'express-validator' );

const feedController = require( '../controllers/feed' );
const isAuth = require( '../middleware/is-auth' );

const router = express.Router();

// GET /feed/posts
router.get( '/posts' , isAuth , feedController.getPosts );

// POST /feed/post
router.post( '/post' , isAuth, [
    /** post validation logic */
    body( 'title' ).trim().isLength( { min : 5 } ),
    body( 'content' ).trim().isLength( { min : 5 } )
] , feedController.createPost );

// GET /post/:postId
router.get( '/post/:postId' , isAuth , feedController.getPost );

// PUT /post/:postId
router.put( '/post/:postId', isAuth , [
    /** post validation logic */
    body( 'title' ).trim().isLength( { min : 5 } ),
    body( 'content' ).trim().isLength( { min : 5 } )
] , feedController.updatePost );

// DELETE /post/:postId
router.delete( '/post/:postId' , isAuth , feedController.deletePost );

module.exports = router;