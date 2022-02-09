import styled from 'styled-components';
import React from "react";

import { Text, Grid } from './index'

const Input = (props) => {
    const { label, placeholder, _onChange, type, multiLine, value, is_Submit, onSubmit } = props;

    if (multiLine) {
        return (
            <Grid>
                {label ? '' : <Text margin='0px'>{label}</Text>}
                <ElTextarea rows={10} value={value} placeholder={placeholder} onChange={_onChange}></ElTextarea>
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <Grid>
                {label ? '' : <Text margin='0px'>{label}</Text>}
                {is_Submit ?
                    <ElInput type={type} 
                    placeholder={placeholder} 
                    onChange={_onChange} 
                    value={value} 
                    onKeyPress={ (e) => {if(e.key === "Enter"){
                        onSubmit(e)}
                        }
                    }
                    /> :
                    <ElInput type={type} 
                    placeholder={placeholder} 
                    onChange={_onChange} 
                    />
                }
            </Grid>
        </React.Fragment>
    )
}

Input.defaultProps = {
    multiLine: false,
    label: '텍스트',
    placeholder: '텍스트를 입력하세요',
    type: 'text',
    value: '',
    is_Submit: false,
    onSubmit: () => {},
    _onChange: () => { },
}
const ElTextarea = styled.textarea`
    border: 1px solid #212121;
    width: 100%;
    padding: 12px 4px;
    box-sizing: border-box;
`
const ElInput = styled.input`
    border: 1px solid #212121;
    width: 100%;
    padding: 12px 4px;
    box-sizing: border-box;
`;

export default Input