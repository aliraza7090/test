import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "react-query";
import {Col, Container, Row} from "react-bootstrap";

import {apis} from "services";
import {imageURL} from "hooks";
import {Loader} from "components";
import {toast} from "react-toastify";

const EditUser = () => {
    const navigate = useNavigate();
    const {search} = useLocation();
    const [id, setId] = useState(null);
    const [user, setUser] = useState({name: '', email: '', password: "", confirmPassword: "", api: ''});
    const [toggleFieldType, setToggleFieldType] = useState({confirmPassword: false, password: false});
    const {isLoading} = useQuery([id], apis.getUser, {
      enabled: !!id,
      onSuccess: ({data}) => setUser(data)
    });
    const {mutate} = useMutation('updateUser', apis.updateUser, {
      onSuccess: ({data}) => {
        toast.success(data)
        navigate(-1);
      }

    })

    useEffect(() => {
      if (search) {
        const _id = search.replace('?', '') //removing '?' from query string
        setId(_id);
      }
    }, [search])

    const onChangeHandler = (e) => setUser(prevState => ({...prevState, [e.target.name]: e.target.value}));
    const onChangeApiHandler = (e, exchange) => setUser(prevState => ({
      ...prevState,
      api: {
        ...prevState['api'], [exchange]: {...prevState['api'][exchange], [e.target.name]: e.target.value}
      }
    }));

    const toggleHandler = (field) => setToggleFieldType(prevState => ({...prevState, [field]: !prevState[field]}))

    const onSubmitHandler = (e) => {
      e.preventDefault();

      if (user.password !== user.confirmPassword) {
        return alert("Password and Confirm Password does not matched")
      }

      mutate({id, body: user});
    }

    return (
      <div className="dashboard-main custom-scroll">
        <Container fluid>
          {isLoading
            ? <div className='vh-100'><Loader variant='light' style={{height: '100%'}}/></div>
            : <>
              <h3 className='section-title'>Edit User</h3>
              <form className='custom-edit-form' onSubmit={onSubmitHandler}>
                <Row>
                  <Col lg={6}>
                    <div className='form-group'>
                      <label htmlFor='name' className='custom-label'>Name</label>
                      <input name='name' id='name' className='form-control custom-input'
                             value={user.name} onChange={onChangeHandler}/>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className='form-group'>
                      <label htmlFor='email' className='custom-label'>Email</label>
                      <input type="email" name='email' id='email'
                             className='form-control custom-input' value={user.email}
                             onChange={onChangeHandler}/>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className='form-group'>
                      <label htmlFor='email' className='custom-label'>Password</label>
                      <div className="position-relative">
                        <input
                          type={toggleFieldType.password ? "text" : "password"}
                          name='password'
                          id='password'
                          className='form-control custom-input' value={user.password}
                          onChange={onChangeHandler}/>
                        <div className="input-icon" onClick={() => toggleHandler('password')}>
                          <i className={`fas ${toggleFieldType.password ? 'fa-eye-slash' : 'fa-eye'}`}/>
                        </div>
                      </div>

                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className='form-group '>
                      <label htmlFor='email' className='custom-label'>Confirm Password</label>
                      <div className="position-relative">
                        <input
                          type={toggleFieldType.confirmPassword ? "text" : "password"}
                          name='confirmPassword'
                          id='confirmPassword'
                          className='form-control custom-input' value={user.confirmPassword}
                          onChange={onChangeHandler}/>
                        <div className="input-icon" onClick={() => toggleHandler('confirmPassword')}>
                          <i className={`fas ${toggleFieldType.confirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}/>
                        </div>
                      </div>
                    </div>
                  </Col>
                  {/*<Col lg={6}>
                                        <h3 className='section-title2'>
                                            <img src={imageURL('kucoin.png')} alt='kucoin'/>
                                        </h3>
                                        <div className='form-group'>
                                            <label htmlFor='apiKey' className='custom-label'>Api Key</label>
                                            <textarea className='form-control custom-input' id="apiKey"
                                                      name="apiKey" rows="2" cols="50"
                                                      onChange={(e) => onChangeApiHandler(e, 'ku_coin')}
                                                      value={user?.api?.ku_coin?.apiKey}></textarea>
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='secret' className='custom-label'>Secret</label>
                                            <textarea className='form-control custom-input' id="secret"
                                                      name="secret" rows="2" cols="50"
                                                      onChange={(e) => onChangeApiHandler(e, 'ku_coin')}
                                                      value={user?.api?.ku_coin?.secret}></textarea>
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='passphrase'
                                                   className='custom-label'>Passphrase </label>
                                            <textarea className='form-control custom-input' id="passphrase"
                                                      name="passphrase" rows="2" cols="50"
                                                      onChange={(e) => onChangeApiHandler(e, 'ku_coin')}
                                                      value={user?.api?.ku_coin?.passphrase}></textarea>
                                        </div>
                                    </Col>*/}
                  <Col lg={12}>
                    <h3 className='section-title2'>
                      <img src={imageURL('binance-logo.png')}/>
                    </h3>
                    <Row>
                      <Col>
                        <div className='form-group'>
                          <label htmlFor='apiKey' className='custom-label'>Api key</label>
                          <textarea className='form-control custom-input' id="apiKey"
                                    name="apiKey" rows="2" cols="50"
                                    onChange={(e) => onChangeApiHandler(e, 'binance')}
                                    value={user?.api?.binance?.apiKey}></textarea>
                        </div>
                      </Col>
                      <Col>
                        <div className='form-group'>
                          <label htmlFor='secret' className='custom-label'>Secret</label>
                          <textarea className='form-control custom-input' id="secret"
                                    name="secret" rows="2" cols="50"
                                    onChange={(e) => onChangeApiHandler(e, 'binance')}
                                    value={user?.api?.binance?.secret}></textarea>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <div className='form-group text-center'>
                    <button className='custom-btn primary-btn col-md-3 col-12' type='submit'>Submit
                    </button>
                  </div>
                </Row>
              </form>
            </>
          }
        </Container>

      </div>
    )
  }
;


export default EditUser
