import React, { useState ,useContext } from "react"
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useForm } from "../untils/hooks";
import { AuthContext  } from "../untils/auth";

function Register(props) {
    const [errors, setErrors] = useState({});
    const context = useContext(AuthContext)
    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(
            _,
            {
                data: { register: userData }
            }
        ) {
            context.login(userData);
            props.history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    function registerUser() {
        addUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={(e) => onSubmit(e)} noValidate className={loading ? 'loading' : ''}>
                <h1>Register</h1>
                <Form.Input
                    label="Usermame"
                    placeholder="Username"
                    name="username"
                    type="text"
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={(e) => onChange(e)}
                />
                <Form.Input
                    label="Email"
                    placeholder="Email.."
                    name="email"
                    type="email"
                    error={errors.email ? true : false}
                    value={values.email}
                    onChange={(e) => onChange(e)}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password.."
                    name="password"
                    type="password"
                    error={errors.password ? true : false}
                    value={values.password}

                    onChange={(e) => onChange(e)}
                />
                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    error={errors.confirmPassword ? true : false}
                    value={values.confirmPassword}
                    onChange={(e) => onChange(e)}
                />
                <Button type="submit" primary>Register</Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">{
                        Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))
                    }</ul>
                </div>

            )}
        </div>
    )
}
const REGISTER_USER = gql`
    mutation register(
        $username : String!
        $email : String!
        $password : String!
        $confirmPassword : String!
    ){
        register(
            registerInput :{
                username : $username
                email : $email
                password : $password
                confirmPassword : $confirmPassword
            }
        ){
            id 
            email
            username
            createAt
            token
            
        }
    }
`
export default Register