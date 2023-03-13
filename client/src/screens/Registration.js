import {useState, useEffect} from "react";
import {Form} from "react-bootstrap";
import {imageURL} from "../hooks";
import {useMutation} from "react-query";
import {apis} from "../services";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../redux/slices/user.slice";

export default function Registration() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user: _user} = useSelector(store => store.user)
    const {isLoading, mutate} = useMutation(apis.registration, {
        onError: error => {
            if(typeof error.message === 'string')
                toast.error(error.message);
            else
                error.message.map(err => toast.error(err))

            // console.error('ERROR IN REGISTRATION', error)
        },
        onSuccess: ({data:user, headers, status}) => {
            if(status === 201) {
                const token = headers['x-auth-token'];
                dispatch(setUser({...user, token}));
                toast.success('Registration Successful');
            }
        }
    });
    const [data, setData] = useState({name: '', email: '', password: '', confirmPassword: ''});

    useEffect(() => {
        if (_user) {
            switch (_user.role) {
                case "ADMIN":
                    navigate('/');
                    break;
                case "SUB_ADMIN":
                    navigate('/')
                    break;
                case "USER":
                    navigate('/user/dashboard')
                    break;
                default:
                    navigate('/')
            }
        }
    }, [_user]);

    const onChangeHandler = (e) => {
        const {name, value} = e.target;

        setData(prevData => ({...prevData, [name]: value}));
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const {confirmPassword, ...formData} = data;

        if(confirmPassword !== formData.password)
            return toast.error('Password and Confirm Password not matched')

        mutate(formData);
    };


    return (
        <main className="login-main w-100">
            <div className="custom-form center-form">
                <Form onSubmit={onSubmitHandler}>
                    {/* <h3 className="section-title text-center">Crypto Bot</h3> */}
                    <div className="form-logo-main">
                        <img src={imageURL('logo.png')} alt=""/>
                    </div>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Name</Form.Label>
                        <Form.Control name='name' className="custom-input" placeholder="Name" value={data.name}
                                      onChange={onChangeHandler}
                                      required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control name='email' type="email" className="custom-input" placeholder="Email"
                                      value={data.email}
                                      onChange={onChangeHandler}
                                      required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name='password' type="password" className="custom-input" placeholder="Password"
                                      value={data.password}
                                      onChange={onChangeHandler}
                                      required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirm_password">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control name='confirmPassword' type="password" className="custom-input"
                                      placeholder="Confirm Password" value={data.confirmPassword}
                                      onChange={onChangeHandler}
                                      required
                        />
                    </Form.Group>
                    <div>
                        <button className="custom-btn primary-btn" type='submit' disabled={isLoading}>
                            {isLoading ? 'Registering' : 'Register'}
                        </button>
                        <button className="custom-btn text-white bg-transparent border-0 text-decoration-underline"
                                onClick={() => navigate('/login')}
                                style={{marginLeft: '15px'}}>
                            Login
                        </button>
                    </div>
                </Form>
            </div>
        </main>
    )

}
