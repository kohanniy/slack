import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChannel } from '../../actions/index';
import { saveDataToDatabase } from '../../firebase/firebaseApi';
import useChildAddedListener from '../../hooks/useChildAddedListener';

function Channels() {
  const {data: channels} = useChildAddedListener('channels');
  
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ inputValues, setInputValues ] = useState({});
  const [ activeChannel, setActiveChannel ] = useState('');
  const { displayName, photoURL } = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleChange = (evt) => {
    setInputValues({...inputValues, [evt.target.name]: evt.target.value});
  }; 

  const setFirstChannel = useCallback(() => {
    const firstChannel = channels[0];
    dispatch(setCurrentChannel(firstChannel));
    setActiveChannel(firstChannel?.id);
  
  }, [channels, dispatch]);

  const changeChannel = (channel) => {
    setActiveChannel(channel.id);
    dispatch(setCurrentChannel(channel));
  };

  const isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (isFormValid(inputValues)) {
      try {
        const { channelName, channelDetails } = inputValues;
        const channelData = {
          id: '',
          name: channelName,
          details: channelDetails,
          createdBy: {
            name: displayName,
            avatar: photoURL
          }
        };
        await saveDataToDatabase('channels', 'channels', channelData);
      } catch (err) {
        console.log(err);
      } finally {
        setInputValues({});
        setModalOpen(false);
      }
    }
  };

  useEffect(() => {
    setFirstChannel();
  }, [setFirstChannel]);

  const displayChannels = (channels) => channels.length > 0 && channels.map((channel) => (
    <Menu.Item
      key={channel.id}
      onClick={() => changeChannel(channel)}
      name={channel.name}
      style={{ opacity: 0.7 }}
      active={channel.id === activeChannel}
    >
      # {channel.name}
    </Menu.Item>
  ));
  
  return (
    <>
      <Menu.Menu style={{ paddingBottom: '2em' }}>
        <Menu.Item>
          <span>
            <Icon name='exchange' /> Каналы
          </span>{' '}
          ({channels?.length}) <Icon name='add' onClick={handleOpenModal} />
        </Menu.Item>
        { displayChannels(channels) }
      </Menu.Menu>
      <Modal basic open={modalOpen} onClose={handleCloseModal}>
        <Modal.Header>Добавить канал</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input 
                fluid
                label='Название канала'
                name='channelName'
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input 
                fluid
                label='Описание канала'
                name='channelDetails'
                onChange={handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' inverted onClick={handleSubmit}>
            <Icon name='checkmark' /> Добавить
          </Button>
          <Button color='red' inverted onClick={handleCloseModal}>
            <Icon name='remove' /> Отменить
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default Channels;
