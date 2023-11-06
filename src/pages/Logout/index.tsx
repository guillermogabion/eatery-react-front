import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LOGOUT } from '../../redux/action/rootAction'; // Import the LOGOUT action type

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Dispatch the LOGOUT action
        dispatch({ type: LOGOUT });

        // Redirect to the login page or any other desired page
        navigate('/');
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;
