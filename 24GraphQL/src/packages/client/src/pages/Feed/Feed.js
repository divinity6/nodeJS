import React, { Component, Fragment } from 'react';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';
import post from "../../components/Feed/Post/Post";

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false
  };

  componentDidMount() {
    fetch('URL')
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch user status.');
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ status: resData.status });
      })
      .catch(this.catchError);

    this.loadPosts();
  }

  /** component 가 Mount 된 후에 호출 */
  loadPosts = direction => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }

    /** Graphql 을 이용하여 필요한 데이터만 가지고온다 */
    const graphqlQuery = {
      query : `
        {  
          posts( page : ${ page } ) {
            posts {
              _id
              title
              content
              imageUrl
              creator {
                name 
              }
              createdAt
            }
            totalPosts
          }
        }
      `
    }

    fetch(`http://localhost:8080/graphql`, {
      method : 'POST',
      headers : {
        Authorization : `Bearer ${ this.props.token }`,
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify( graphqlQuery )
    } )
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if ( resData.errors ){
          throw new Error( 'Fetching posts failed.' );
        }
        this.setState({
          posts: resData.data.posts.posts.map( post => {
            return {
              ...post,
              imagePath : post.imageUrl,
            }
          } ),
          totalPosts: resData.data.posts.totalPosts,
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = event => {
    event.preventDefault();
    fetch('URL')
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't update status!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = postId => {
    this.setState(prevState => {
      const loadedPost = { ...prevState.posts.find(p => p._id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  /** edit 이 끝났을 경우 타는 handler */
  finishEditHandler = postData => {
    console.log( '<< finish Edit >>' , postData );
    this.setState({
      editLoading: true
    });

    const formData = new FormData();
    // formData.append( 'title' , postData.title );
    // formData.append( 'content' , postData.content );
    formData.append( 'image' , postData.image );

    /** formData 의 이미지 처리는 editMode 일때 사용한다 */
    if ( this.state.editPost ){
      formData.append( 'oldPath' , this.state.editPost.imagePath );
    }

    /** GraphQL 을 보내기전에, Image 를 저장하기 위해, 일반적인 http-request query 를 보낸다 */
    fetch( `http://localhost:8080/post-image` , {
      method : 'PUT',
      headers : {
        Authorization : `Bearer ${ this.props.token }`,
      },
      body : formData
    } )
      .then( res => res.json() )
      .then( fileResData => {
        /** 서버에서 전송한 filePath 필드를 가져옴 */
        const imageUrl = fileResData.filePath;

        let graphqlQuery = {
          query : `
                    mutation {
                      createPost( postInput : { 
                        title : "${ postData.title }" , 
                        content : "${ postData.content }" , 
                        imageUrl: "${ imageUrl }" 
                      } ) {
                        _id
                        title
                        content
                        imageUrl
                        creator {
                          name
                        }
                        createdAt
                      }
                    }
                  `
        }

        /** 서버측 어플리케이션에 컨텐츠 전송 */
        return fetch( `http://localhost:8080/graphql` , {
          method : 'POST',
          headers : {
            Authorization : `Bearer ${ this.props.token }`,
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify( graphqlQuery ),
        } );
      } )
      .then(res => {
        return res.json();
      })
      .then(resData => {
        if ( resData.errors && 422 === resData.errors[ 0 ].status ){
          throw new Error( "Validation failed. Make sure the email address isn't used yet!" );
        }
        if ( resData.errors ){
          throw new Error( 'User login failed.' );
        }

        console.log( '<< editHandler >>' , resData );
        const post = {
          _id: resData.data.createPost._id,
          title: resData.data.createPost.title,
          content: resData.data.createPost.content,
          creator: resData.data.createPost.creator,
          createdAt: resData.data.createPost.createdAt,
          imagePath : resData.data.createPost.imageUrl,
        };
        this.setState(prevState => {
          let updatedPosts = [ ...prevState.posts ];
          /**
           * - edit 을 했을 경우에는 해당 post 내용을 변경하고,
           *   새로 추가했을 경우에는 새로운 Post 를 추가
           */
          if ( prevState.editPost ){
            const postIndex = prevState.posts.findIndex( p => p._id === prevState.editPost._id );
            updatedPosts[ postIndex ] = post;
          }
          else {
            /**
             * - 새게시물을 추가할경우 기존게시물을 안보이게하기 위하여
             * --> 배열에서 제거
             */
            updatedPosts.pop();
            updatedPosts.unshift( post );
          }
          return {
            posts : updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false
          };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = postId => {
    this.setState({ postsLoading: true });
    fetch(`http://localhost:8080/feed/post/${ postId }` , {
      method : 'DELETE',
      headers : {
        Authorization : `Bearer ${ this.props.token }`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Deleting a post failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.loadPosts();
        // this.setState(prevState => {
        //   const updatedPosts = prevState.posts.filter(p => p._id !== postId);
        //   return { posts: updatedPosts, postsLoading: false };
        // });
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    console.log( '<< Feed Catch err >>' , error );
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'previous')}
              onNext={this.loadPosts.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map(post => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                  onDelete={this.deletePostHandler.bind(this, post._id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
