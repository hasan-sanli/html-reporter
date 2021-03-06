'use strict';
import React, {Component, Fragment} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../modules/actions';
import ControlButton from './control-button';
import ViewSelect from './view-select';
import BaseHostInput from './base-host-input';
import MenuBar from './menu-bar';

class ControlButtons extends Component {
    render() {
        const {view, actions} = this.props;

        return (
            <Fragment>
                <ViewSelect options = {[
                    {value: 'all', text: 'Show all'},
                    {value: 'failed', text: 'Show only failed'}
                ]}/>
                <div className="control-group">
                    <ControlButton
                        label="Expand all"
                        isControlGroup={true}
                        isActive={view.expand === 'all'}
                        handler={actions.expandAll}
                    />
                    <ControlButton
                        label="Collapse all"
                        isControlGroup={true}
                        isActive={view.expand === 'none'}
                        handler={actions.collapseAll}
                    />
                    <ControlButton
                        label="Expand errors"
                        isControlGroup={true}
                        isActive={view.expand === 'errors'}
                        handler={actions.expandErrors}
                    />
                    <ControlButton
                        label="Expand retries"
                        isControlGroup={true}
                        isActive={view.expand === 'retries'}
                        handler={actions.expandRetries}
                    />
                </div>
                <ControlButton
                    label="Show skipped"
                    isActive={view.showSkipped}
                    handler={actions.toggleSkipped}
                />
                <ControlButton
                    label="Show only diff"
                    isActive={view.showOnlyDiff}
                    handler={actions.toggleOnlyDiff}
                />
                <ControlButton
                    label="Scale images"
                    isActive={view.scaleImages}
                    handler={actions.toggleScaleImages}
                />
                <ControlButton
                    label="Lazy load"
                    isActive={Boolean(view.lazyLoadOffset)}
                    handler={actions.toggleLazyLoad}
                />
                <ControlButton
                    label="Group by error"
                    isActive={Boolean(view.groupByError)}
                    handler={actions.toggleGroupByError}
                />
                <BaseHostInput/>
                <MenuBar />
            </Fragment>
        );
    }
}

export default connect(
    ({reporter: state}) => ({view: state.view}),
    (dispatch) => ({actions: bindActionCreators(actions, dispatch)})
)(ControlButtons);
