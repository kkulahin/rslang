import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Header, Modal,
} from 'semantic-ui-react';
import Button from '../button/Button';
import './modal.scss';

export default class ModalWindow extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: true,
    };
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  render() {
    const {
      label, modalSize, content, contentHeader, clickHandler, okHandler, cancelHandler
    } = this.props;

    const { modalOpen } = this.state;
    return (
      <Modal
        open={modalOpen}
        onClose={this.handleClose}
        closeIcon
        size={modalSize} // mini,tiny,small,large,fullscreen
        dimmer="blurring"
      >
        <Header content={contentHeader} />
        <Modal.Content>
          {content}
        </Modal.Content>
        <Modal.Actions>
          {(okHandler
          && (
          <>
            <Button id="1" label="Cancel" clickHandler={() => { this.handleClose(); cancelHandler(); }} />
            <Button id="2" label={label} clickHandler={() => { this.handleClose(); okHandler(); }} />
          </>
          )) || <Button id="2" label="Ok" clickHandler={() => { this.handleClose(); clickHandler(); }} /> }
        </Modal.Actions>
      </Modal>
    );
  }
}

ModalWindow.propTypes = {
  label: PropTypes.string,
  modalSize: PropTypes.string,
  content: PropTypes.string.isRequired,
  contentHeader: PropTypes.string,
  clickHandler: PropTypes.func,
  okHandler: PropTypes.func,
  cancelHandler: PropTypes.func,
};

ModalWindow.defaultProps = {
  label: 'Ok',
  contentHeader: 'message',
  modalSize: 'small',
  clickHandler: () => {},
  okHandler: () => {},
  cancelHandler: () => {},
};
