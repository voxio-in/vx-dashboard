import streamlit as st 


from api_ import (
    get_current_config , 
    update_config
)

def validate_sample_rate(sample_rate : float | int , config : dict ) -> bool : return sample_rate in config['stt']['settings']['standard-sample-rates']


def get_stt_models(provider : str , config : dict) -> list : 

    if provider == 'groq' : return config['stt']['groq']['models']
    elif provider == 'deepgram' : return config['stt']['deepgram']['models']

    else : return []

def render_stt_section(config : dict) : 

    stt_config : dict = config['stt-section']
    base_service : str = stt_config['base']['service']
    base_sample_rate : str = stt_config['base']['sample-rate']

    st.subheader(stt_config['heading'])

    st.info("STT configuration coming soon...")
    
    # current_stt = get_current_config(st.session_state.api_key , 'stt' , config = config)
    # current_provider = current_stt.get('service' , base_service) if current_stt else base_service
    
    # provider = st.selectbox(
    #     'Provider' , 
    #     options = stt_config['services'] , 
    #     index = 0 if current_provider == base_service else 1 , 
    #     key = 'stt_provider_select'
    # )
    
    # if provider != st.session_state.stt_provider : st.session_state.stt_provider = provider ; st.rerun()
    
    # model_options : list = get_stt_models(provider , config = config)
    
    # with st.form('stt_form') : 

    #     current_model = current_stt.get('model') if current_stt else model_options[0]

    #     if current_model not in model_options : current_model = model_options[0]
        
    #     model = st.selectbox(
    #         'Model' , 
    #         options = model_options , 
    #         index = model_options.index(current_model) if current_model in model_options else 0
    #     )
        
    #     current_rate : int = current_stt.get('sample_rate' , base_sample_rate) if current_stt else base_sample_rate
 
    #     sample_rate = st.number_input(
    #         'Sample Rate' ,  
    #         min_value = stt_config['sample-rate-range'][0] ,  
    #         max_value = stt_config['sample-rate-range'][1] ,  
    #         value = current_rate , 
    #         step = stt_config['sample-rate-step']
    #     )
        
    #     if not validate_sample_rate(sample_rate = sample_rate , config = config) : st.warning(f'⚠️ {sample_rate} is not a standard sample rate. Standard rates include: 8000, 16000, 22050, 24000, 44100, 48000')
        
    #     prompt = ''

    #     if provider == 'groq' : 

    #         current_prompt = current_stt.get('prompt' , '') if current_stt else ''

    #         prompt = st.text_area(
    #             'Prompt' , 
    #             value = current_prompt ,  
    #             help = 'Optional prompt to improve speech recognition of specific words or names'
    #         )
        
    #     if st.form_submit_button('Update STT Config' , use_container_width = True) : 

    #         config = {
    #             'service' : provider , 
    #             'model' : model , 
    #             'sample_rate' : sample_rate
    #         }

    #         if provider == 'groq' and prompt : config['prompt'] = prompt
            
    #         if update_config(st.session_state.api_key , 'stt' , config) : st.success('STT configuration updated!') ; st.rerun()
    #         else : st.error('Failed to update STT configuration')