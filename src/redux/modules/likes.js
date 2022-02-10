import { createAction, handleActions } from 'redux-actions'
import { produce } from 'immer'
import { firestore } from '../../shared/firebase';
import { actionCreators as postActions } from './post';
import firebase from 'firebase';

//액션
const IS_LIKE = 'IS_LIKE' //라이크가 있는지 알아보기
const GET_LIKE = 'GET_LIKE' //라이크를 가져오기

//액션생성함수
const isLike = createAction(IS_LIKE, (is_like) => ({ is_like })) //라이크가 있는지만 알면됨
const getLike = createAction(GET_LIKE, (post_id, list) => ({ post_id, list })) //가져오려면 post의 id값과 좋아요 list 있으면됨

//초기값
const initialState = {
    list: {},
    is_like: false,
};

//미들웨어

// 라이크 파이어스토어에서 가져오기
const getLikeFB = (post_id = null) => {
    return function (dispatch, getState, {history}){
        if(!post_id){
            return;
        }

        const likeDB = firestore.collection("like")

        likeDB.where("post_id", "==", post_id).get().then((docs) => {
            let list = [];
            docs.forEach((doc) => {
                list.push(doc.data().user_id)
            });

            dispatch(getLike(post_id, list));
        }). catch((error) => {
            console.log("좋아요 정보를 가져올 수 없어요", error);
        })
    }
};

// 라이크 파이어스토어에 추가하기
const plusLikeFB  = (post_id, user_id) => {
    return function (dispatch, getState, {history}){
        const likeDB = firestore.collection("like")
        const user_info = getState().user.user;
        const post = getState().post.list.find(l => l.id === post_id)

        let _like = {
            post_id: post_id,
            user_id: user_info.uid,
            is_like: true,
        };

        likeDB.add(_like).then((doc) => {
            const postDB = firestore.collection("post")
            const increment = firebase.firestore.FieldValue.increment(1);

            postDB.doc(post_id).update({likes: increment}).then((res) =>{
                dispatch(postActions.editPost(post_id, { likes: parseInt(post.likes) + 1}),
                );
            });
            dispatch(isLike(true));
        });
        
    };

};

// 라이크 파이어스토어에서 빼기
const minusLikeFB = (post_id, user_id) => {
    return function (dispatch, getState, {history}){
        const likeDB = firestore.collection("like")

        likeDB.where('post_id', '==', post_id).get().then((docs) => {

          let likes = [];

          docs.forEach((doc) => {
            likes.push({ ...doc.data(), id: doc.id });
          });

          const user_like = likes.filter((d) => {
            return d.user_id === user_id;
          });
  
          likeDB.doc(user_like[0].uid).delete().then((doc) => {
              const postDB = firestore.collection('post');
              const post = getState().post.list.find((p) => p.id === post_id);
              const decrement = firebase.firestore.FieldValue.increment(-1);

              postDB.doc(post_id).update({ likes: decrement }).then((res) => {
                  dispatch(postActions.editPost(post_id, {likes: parseInt(post.likes) - 1,}),
                  );
                });
              dispatch(isLike(false));
            });
        });
    };
  };


//리듀서
export default handleActions(
    {
        [IS_LIKE]: (state,action) => produce(state, (draft) =>{
            draft.is_like = action.payload.is_like
        }),

        [GET_LIKE]: (state,action) => produce(state, (draft) =>{
            draft.list[action.payload.post_id] = action.payload.list
        }),
    }, initialState,
)


//익스포트
const actionCreators ={
    isLike,
    getLikeFB,
    plusLikeFB,
    minusLikeFB,
}

export {actionCreators}