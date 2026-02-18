import { useEffect, useState } from 'react';
import { useAuth } from '../../context/Auth/useAuth';
import { useNavigate } from 'react-router';

export const useLoginPage = () => {
  const [ formLogin, setFormLogin ] = useState({email: '', password: '', rememberMe: false});
  const [ errorsLogin, setErrorsLogin ] = useState({email: '', password: ''});
  const { login, isLoading, error, userSession } = useAuth();
  const { isLoggedIn } = userSession;
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  useEffect(()=>{
    if(error){
      alert(error);
    }
  },[error]);

  const handleInputChange = (e) => {
    if(e.target.value.trim().length === 0){
      setErrorsLogin({...errorsLogin, [e.target.name]: 'Este campo es requerido'});
    }else{
      setErrorsLogin({...errorsLogin, [e.target.name]: ''});
    }
    setFormLogin({...formLogin, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        login(formLogin)
    }catch(error){
      alert(error.message);
    }
  };

  const handleRememberMeClick = () => {
    setFormLogin({...formLogin, rememberMe: !formLogin.rememberMe});
  }
  

  return {
      formLogin,
      errorsLogin,
      isLoading,
      error,
      userSession,
      handleInputChange,
      handleSubmit,
      handleRememberMeClick
  }
}