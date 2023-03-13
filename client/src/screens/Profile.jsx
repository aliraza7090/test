import { Loader } from 'components';
import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apis } from 'services';


const Profile = () => {
    const navigate = useNavigate();
    const { user :loggedUser } = useSelector( state => state.user )
    const [ user, setUser ] = useState( { name :'', email :'', password :"", confirmPassword :"" } );
    const [ toggleFieldType, setToggleFieldType ] = useState( { confirmPassword :false, password :false } );
    const { isLoading } = useQuery( [ loggedUser?._id ], apis.getUserProfile, {
        enabled : !!loggedUser?._id,
        onSuccess :( { data } ) => setUser( data )
    } );

    const { mutate } = useMutation( 'updateUserProfile', apis.updateUserProfile, {
        onSuccess :( { data } ) => {
            toast.success( data )
        }
    } )

    const onChangeHandler = ( e ) => setUser( prevState => ( { ...prevState, [ e.target.name ] :e.target.value } ) );
    const toggleHandler = ( field ) => setToggleFieldType( prevState => ( {
        ...prevState,
        [ field ] : !prevState[ field ]
    } ) )
    const onSubmitHandler = ( e ) => {
        e.preventDefault();

        if ( user.password !== user.confirmPassword ) {
            return alert( "Password and Confirm Password does not matched" )
        }

        mutate( { id :loggedUser?._id, body :user } );
    }

    return <>
      <div className = 'dashboard-main custom-scroll'>
        <Container fluid>
          { isLoading
              ? <div className = 'vh-100'><Loader variant = 'light' style = { { height :'100%' } } /></div>
              : <>
              <h3 className = 'section-title'>Edit User</h3>
              <form className = 'custom-edit-form' onSubmit = { onSubmitHandler }>
                <Row>
                  <Col lg = { 6 }>
                    <div className = 'form-group'>
                      <label htmlFor = 'name' className = 'custom-label'>Name</label>
                      <input
                          name = 'name' id = 'name' className = 'form-control custom-input'
                          value = { user.name } onChange = { onChangeHandler } />
                    </div>
                  </Col>
                  <Col lg = { 6 }>
                    <div className = 'form-group'>
                      <label htmlFor = 'email' className = 'custom-label'>Email</label>
                      <input
                          type = 'email' name = 'email' id = 'email'
                          className = 'form-control custom-input' value = { user.email }
                          onChange = { onChangeHandler }  disabled/>
                    </div>
                  </Col>
                  <Col lg = { 6 }>
                    <div className = 'form-group'>
                      <label htmlFor = 'email' className = 'custom-label'>Password</label>
                      <div className = 'position-relative'>
                        <input
                            type = { toggleFieldType.password ? "text" : "password" }
                            name = 'password'
                            id = 'password'
                            className = 'form-control custom-input' value = { user.password }
                            onChange = { onChangeHandler } />
                        <div className = 'input-icon' onClick = { () => toggleHandler( 'password' ) }>
                          <i className = { `fas ${ toggleFieldType.password ? 'fa-eye-slash' : 'fa-eye' }` } />
                        </div>
                      </div>

                    </div>
                  </Col>
                  <Col lg = { 6 }>
                    <div className = 'form-group '>
                      <label htmlFor = 'email' className = 'custom-label'>Confirm Password</label>
                      <div className = 'position-relative'>
                        <input
                            type = { toggleFieldType.confirmPassword ? "text" : "password" }
                            name = 'confirmPassword'
                            id = 'confirmPassword'
                            className = 'form-control custom-input' value = { user.confirmPassword }
                            onChange = { onChangeHandler } />
                        <div className = 'input-icon' onClick = { () => toggleHandler( 'confirmPassword' ) }>
                          <i className = { `fas ${ toggleFieldType.confirmPassword ? 'fa-eye-slash' : 'fa-eye' }` } />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <div className = 'form-group text-center'>
                    <button className = 'custom-btn primary-btn col-md-3 col-12' type = 'submit'>Submit
                    </button>
                  </div>
                </Row>
              </form>
            </>
          }
        </Container>

      </div>
  </>
};

export default Profile
