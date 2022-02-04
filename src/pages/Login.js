import React, { useState } from 'react';
import styled from 'styled-components';
import {Input, Text, Grid, Button} from '../elements'
import { setCookie } from '../shared/Cookie'
import { useDispatch } from 'react-redux';
import {actionCreators as userActions} from '../redux/modules/user'

const Login = (props) => {

    const dispatch = useDispatch()

    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');

    const login = () => {

        if(id === '' || pwd ===''){
            window.alert('아이디 혹은 비밀번호가 공란입니다');
            return ;
        }

        dispatch(userActions.loginFB(id, pwd))
    }

    return (
        <React.Fragment>
            <Grid padding="16px">
                <Text size='32px' bold>로그인</Text>
                <Grid padding="16px 0px">
                    <Input label='아이디' placeholder='아이디를 입력하세요'  _onChange={(e) => {setId(e.target.value)}} />
                </Grid>
                <Grid padding='16px 0px'>
                    <Input label='비밀번호' placeholder='비밀번호를 입력하세요' type='password' _onChange={(e) => {setPwd(e.target.value)}} />
                </Grid>
                <Button text="로그인하기" _onClick={() => {login()}}></Button>
            </Grid>
        </React.Fragment>
    )
}

export default Login









