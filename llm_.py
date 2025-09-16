import streamlit as st 

from api_ import (
    get_current_config , 
    update_config
)

def get_llm_models(provider : str , config : dict) -> list : 

    if provider == 'groq' : return config['llm']['groq']['models']
    elif provider == 'gemini' : return config['llm']['gemini']['models']
    else : return []

def render_llm_section(config : dict) : 

    llm_config : dict = config['llm-section']
    base_service : str = llm_config['base']['service']
    
    st.subheader(llm_config['heading'])
    
    current_llm = get_current_config(
        st.session_state.api_key , 
        'llm' , 
        config = config 
    )

    current_provider = current_llm.get('service' , base_service) if current_llm else base_service
    
    provider = st.selectbox(
        'Provider' , 
        options = llm_config['services'] ,  
        index = 0 if current_provider == base_service else 1 , 
        key = 'llm_provider_select'
    )
    
    if provider != st.session_state.llm_provider : st.session_state.llm_provider = provider ; st.rerun()
    
    model_options = get_llm_models(provider = provider , config = config)
    
    with st.form('llm_form'):
        
        current_model = current_llm.get('model') if current_llm else model_options[0]

        if current_model not in model_options : current_model = model_options[0]
        
        model = st.selectbox(
            'Model' , 
            options = model_options , 
            index = model_options.index(current_model) if current_model in model_options else 0
        )
        
        current_prompt = current_llm.get('prompt' , '') if current_llm else ''

        prompt = st.text_area(
            'System Prompt' , 
            value = current_prompt , 
            help = "System prompt to guide the model's behavior"
        )
        
        if st.form_submit_button('Update LLM Config' , use_container_width = True) : 

            service_config = {
                'service' : provider , 
                'model' : model
            }

            if prompt : service_config['prompt'] = prompt
            
            if update_config(
                api_key = st.session_state.api_key , 
                service_type = 'llm' , 
                config = config , 
                updating_config = service_config
            ) : st.success('LLM configuration updated!') ; st.rerun()
            else : st.error('Failed to update LLM configuration')