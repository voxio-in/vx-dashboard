import streamlit as st 
from api_ import (
    get_current_config , 
    update_config
)

def render_tts_section(config : dict) : 

    tts_config : dict = config['tts-section']

    st.subheader(tts_config['heading'])
    
    # current_tts = get_current_config(st.session_state.api_key, "tts" , config = config )
    
    # with st.form("tts_form"):
    st.info("TTS configuration coming soon...")
        
        # # Placeholder prompt field
        # current_prompt = current_tts.get('prompt', '') if current_tts else ''
        # prompt = st.text_area("Prompt", value=current_prompt,
        #                     help="Configuration prompt for TTS (placeholder)")
        
        # if st.form_submit_button("Update TTS Config", use_container_width=True):
        #     config = {"service": "edge"}  # Default from your API
        #     if prompt:
        #         config["prompt"] = prompt
            
        #     if update_config(st.session_state.api_key, "tts", config):
        #         st.success("TTS configuration updated!")
        #         st.rerun()
        #     else:
        #         st.error("Failed to update TTS configuration")