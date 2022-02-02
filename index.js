import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {nullTargetFilter} from 'src/utils/Functons';

import style from './style.module.scss';

class DropdownLanguages extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            languages: props.languages,
            selectedService: props.selectedService,
            isOpen: false
        };
        this.changeLanguagePair = this.changeLanguagePair.bind(this);
        this.changeSelectState = this.changeSelectState.bind(this);
        this.documentClick = this.documentClick.bind(this);
        this.mySelect = React.createRef();
    }

    changeLanguagePair(lang){
        let selectedPairs = [];

        let {selectedService, languages = []} = this.props;

        if(selectedService.source_language) selectedPairs = selectedService.target_languages? selectedService.target_languages.filter(l => languages.includes(l.target_language_gtp_id)).map(l => l.target_language_gtp_id) : [];

        if(selectedPairs.includes(lang.target_language_gtp_id) && selectedPairs.length > 1) selectedPairs = selectedPairs.filter(c => c !== lang.target_language_gtp_id);
        else if(!selectedPairs.includes(lang.target_language_gtp_id)) selectedPairs.push(lang.target_language_gtp_id);

        this.props.languagesUpdate(selectedPairs);
    }

    selectAllLanguagePair(){
        let {selectedService, languages = []} = this.props,
            allOptions = selectedService.target_languages? selectedService.target_languages.filter(l => (l.target_language_gtp_id || l.gtp_id) && l.title).map(l => l.target_language_gtp_id) : [],
            isSelectedAll = allOptions.length === languages.length && allOptions.length;
	if(isSelectedAll) {
            this.props.languagesUpdate([languages[0]]);
        }
        else{
            this.props.languagesUpdate(allOptions);
        }
    }

    changeSelectState(){
        this.setState( { isOpen: !this.state.isOpen } );
    }

    componentDidMount() {
        document.addEventListener('click', this.documentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.documentClick);
    }

    documentClick(e){
        if(!this.mySelect.current.contains(e.target) && this.state.isOpen) this.changeSelectState();
    }

    render() {
        let selectedPairsHtml = [],
            selectedPairs = [],
            options = [],
            optionsIDs = [];

        let {selectedService, languages = []} = this.props;
        let {isOpen} = this.state;
        let disabled = !selectedService.target_languages.length;
	    
        if(selectedService.source_language){
            options = selectedService.target_languages.filter(l => l.target_language_gtp_id).map(lang => {
                let isSelected = languages.includes(lang.target_language_gtp_id);
                let box = isSelected?
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 4C0 1.79086 1.79086 0 4 0H16C18.2091 0 20 1.79086 20 4V16C20 18.2091 18.2091 20 16 20H4C1.79086 20 0 18.2091 0 16V4Z" fill="#3798F3"></path><path d="M5 11L8.33333 14L15 6" stroke="white" stroke-width="2" stroke-linecap="round"></path></svg>
                    :
                    <div className={style['box']}></div>;

                if(isSelected) {
                    selectedPairsHtml.push(<span key={lang.target_language_gtp_id}><span>{selectedService.source_language}</span><span>{lang.title}</span></span>);
                    selectedPairs.push(lang.target_language_gtp_id);
                }
                optionsIDs.push(lang.target_language_gtp_id);
                return (
                    <div className={`${style['item']} ${isSelected? style['selected'] : ''} ${languages.length === 1? style['disabled']:''}`} key={lang.target_language_gtp_id} onClick={ () => this.changeLanguagePair(lang) }>
                        {box}
                        <span className={style['lang']}>
                            <span>{selectedService.source_language}</span>
                            <span>{lang.title}</span>
                        </span>
                    </div>
                );
            });
        }

        let isSelectedAll = optionsIDs.length === selectedPairs.length && optionsIDs.length;

        if(!selectedPairsHtml.length) selectedPairsHtml = 'Select 1 or more language pairs for this source file';

        let isDisabledCheck = languages.length === 1;

        return (
            <div ref={this.mySelect} className={`${style['select']} ${isOpen? style['open'] : ''} ${disabled? style['disabled'] : ''}`}>
                <div className={style['view']} onClick={() => this.changeSelectState()}>
                    {selectedPairsHtml}
                </div>
                <div className={style['items']}>
                    <div className={`${style['item']} ${style['all']} ${isSelectedAll? style['selected'] : ''} ${isDisabledCheck? style['disabled']:''}`} onClick={() => this.selectAllLanguagePair()}>
                        {
                            isSelectedAll
                            ?
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 4C0 1.79086 1.79086 0 4 0H16C18.2091 0 20 1.79086 20 4V16C20 18.2091 18.2091 20 16 20H4C1.79086 20 0 18.2091 0 16V4Z" fill="#3798F3"></path><path d="M5 11L8.33333 14L15 6" stroke="white" stroke-width="2" stroke-linecap="round"></path></svg>
                            :
                            <div className={style['box']}></div>
                        }
                        All pairs
                    </div>
                    {options}
                </div>
            </div>
        );
    }
}

export default DropdownLanguages
