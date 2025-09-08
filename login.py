import streamlit as st 

from api_ import (
    authenticate_user , 
    get_user_api_key , 
    signup_user
)

def login_tab_(config : dict) : 

    st.header('Login')

    with st.form('login_form') : 

        username = st.text_input('Username')
        password = st.text_input('Password' , type = 'password')

        submit = st.form_submit_button('Login')
        
        if submit : 

            if username and password : 

                if authenticate_user(
                    username = username , 
                    password = password , 
                    config = config 
                ) : 

                    api_key : str | None = get_user_api_key(
                        username = username , 
                        config = config
                    )

                    if api_key : 

                        st.session_state.authenticated = True
                        st.session_state.username = username
                        st.session_state.api_key = api_key

                        st.success('Login successful!')
                        st.rerun()

                    else : st.error('Could not retrieve API key')
                else : st.error('Invalid username or password')
            else : st.error('Please enter both username and password')

def signup_tab_(config : dict) :  

    st.header('Sign Up')

    with st.form('signup_form') : 

        new_username = st.text_input('Choose Username')

        new_password = st.text_input('Choose Password' , type = 'password')
        confirm_password = st.text_input('Confirm Password' , type = 'password')

        submit = st.form_submit_button('Sign Up')
        
        if submit : 

            if new_username and new_password and confirm_password : 

                if new_password == confirm_password : 

                    api_key = signup_user(
                        username = new_username , 
                        password = new_password , 
                        config = config 
                    )

                    if api_key : 

                        st.session_state.authenticated = True
                        st.session_state.username = new_username
                        st.session_state.api_key = api_key
                        st.success(f'Account created successfully!')
                        st.info('Your API key is displayed on the dashboard.')
                        st.rerun()

                    else : st.error('Username already exists or signup failed')
                else : st.error('Passwords do not match')
            else : st.error('Please fill all fields')


def login_page(config : dict ) : 

    st.title('🔐 Authentication')
    
    login_tab , signup_tab = st.tabs(['Login' , 'Sign Up'])
    
    with login_tab : login_tab_(config = config)
    with signup_tab : signup_tab_(config = config)

