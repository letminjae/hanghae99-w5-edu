import { createAction, handleActions } from 'redux-actions'
import { produce } from 'immer'
import { storage } from '../../shared/firebase'; // 이미지는 파이어베이스의 스토리지에서

//action
const UPLOADING = 'UPLOADING'; //업로드 할 이미지 불러오기
const UPLOAD_IMAGE = 'UPLOAD_IMAGE'; //이미지 업로드하기
const SET_PREVIEW = 'SET_PREVIEW' // 미리보기 보여주기

//create action function
const uploading = createAction(UPLOADING, (uploading) => ({uploading}));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({image_url}));
const setPreview = createAction(SET_PREVIEW, (preview) => ({preview}))

//초기값
const initialState = {
    image_url: '', //처음 이미지는 빈값
    uploading: false, // 처음 업로딩은 하지않은 상태
    preview: null, // 처음 미리보기는 없음
}

//미들웨어

//파이어베이스에서 이미지를 불러오는 미들웨어
//이미지를 불러오는걸 true로 변환해준다
//스토리지에서 이미지를 불러온 후 타입파일에다가 불러오기
const uploadImageFB = (image) => {
    return function (dispatch, getState, { history }){

        dispatch(uploading(true));

        const _upload = storage.ref(`images/${image.name}`).put(image)

        _upload.then((snapshot) => {
            console.log(snapshot)
            snapshot.ref.getDownloadURL().then((url) => {
                dispatch(uploadImage(url))
                console.log(url);
            })
        })
    }
}




//reducer
export default handleActions(
    {
        [UPLOADING]: (state, action) => produce(state, (draft) => {
            draft.uploading = action.payload.uploading;
        }), // 이미지를 불러온다

        [UPLOAD_IMAGE]: (state, action) => produce(state, (draft) => {
            draft.image_url = action.payload.image_url; //업로드 버튼을 누르면 image_url이 저장된다
            draft.uploading = false; //업로드 버튼을 누르면 버튼은 false로 바뀐다
        }),
        [SET_PREVIEW]: (state, action) => produce(state, (draft) => {
            draft.preview = action.payload.preview; //이미지 미리보기를 할 수 있다
        }),
    }, initialState
);

const actionCreators = {
    uploadImage,
    uploadImageFB,
    setPreview,
}

export { actionCreators };