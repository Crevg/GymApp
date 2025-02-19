"use client"
import { Fragment, useContext, useState } from 'react';
import style from './tabs.module.css'
import { ActiveTabContext } from '@/app/context/tabsState';

export default function Tabs() {

    const { activeTab, setActiveTab, needTabs, setNeedTabs } = useContext(ActiveTabContext);

    return <div className={style.tabs}>
        {needTabs && <Fragment>
            <div className={`${style.tab} ${activeTab === 0 ? style.activeTab : ''}`} onClick={() => setActiveTab(0)}> Criss </div>
            <div className={`${style.tab} ${activeTab === 1 ? style.activeTab : ''}`} onClick={() => setActiveTab(1)}> Lei</div>
        </Fragment>}
    </div>
}