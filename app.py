import streamlit as st

from dotenv import load_dotenv

load_dotenv()

from stt_ import render_stt_section
from llm_ import render_llm_section
from tts_ import render_tts_section
from login import login_page

import yaml

def init_session_state() : 

    if 'authenticated' not in st.session_state : st.session_state.authenticated = False
    if 'api_key' not in st.session_state : st.session_state.api_key = ""
    if 'username' not in st.session_state : st.session_state.username = ""

    if 'stt_provider' not in st.session_state : st.session_state.stt_provider = 'groq'
    if 'llm_provider' not in st.session_state : st.session_state.llm_provider = 'groq'

def main_dashboard(config : dict):

    with st.sidebar:
        st.write(f"Welcome, **{st.session_state.username}**!")
        
        st.divider()
        
        if st.button(
            '🚪 Logout' , 
            type = "primary" , 
            use_container_width = True
        ) : 

            st.session_state.authenticated = False
            st.session_state.api_key = ""
            st.session_state.username = ""
            st.rerun()
    
    st.title(config['dashboard']['title'])
    
    st.subheader(config['dashboard']['subheader'])
    
    st.code(st.session_state.api_key , language = None)
    
    st.divider()

    stt_tab , llm_tab , tts_tab = st.tabs(['STT' , 'LLM' , 'TTS'])
    
    with stt_tab : render_stt_section(config = config)
    with llm_tab : render_llm_section(config = config)
    with tts_tab : render_tts_section(config = config)

def main(config : dict) : 

    st.set_page_config(
        page_title = "API Configuration Dashboard" , 
        page_icon = "🔧" , 
        layout = "wide" , 
        initial_sidebar_state = "expanded"
    )

    with open('custom_css.css') as custom_css_file : custom_css : str = custom_css_file.read()
    
    st.markdown(custom_css , unsafe_allow_html = True)

    init_session_state()
    
    if not st.session_state.authenticated : login_page(config = config)
    else : main_dashboard(config = config)

if __name__ == "__main__" : 

    with open('config.yml') as config_file : config : dict = yaml.safe_load(config_file)

    main(config = config)