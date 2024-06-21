const AuthService = {
    isAuthenticated: () => {
      const token = localStorage.getItem('token');
      return !!token; 
    },
  
    login: (token:string) => {
      localStorage.setItem('token', token);
    },
  
    logout: () => {
      localStorage.removeItem('token');
    },
  
    getToken: () => {
      return localStorage.getItem('token');
    }
  };
  
  export default AuthService;
  