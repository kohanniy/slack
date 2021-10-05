import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react';
import { ref, push, child, update, get } from 'firebase/database';
import { db } from '../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChannel } from '../../actions/index';

function Channels() {
  const channelsRef = child(ref(db), 'channels');
  const updatesChannels = {};

  const [channels, setChannels] = useState([]);
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ inputValues, setInputValues ] = useState({});
  const [ firstLoad, setFirstLoad ] = useState(true);
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
    if (firstLoad && channels.length > 0) {
      dispatch(setCurrentChannel(firstChannel));
      setActiveChannel(firstChannel.id);
    }
    setFirstLoad(false);
  }, [channels, dispatch, firstLoad]);

  const getChannels = useCallback(async () => {
    try {
      const snapshot = await get(channelsRef);
      if (snapshot.val()) {
        const data = snapshot.val();
        const keys = Object.keys(data);
        const channelsArray = keys.map((key) => data[key]);
        setChannels(channelsArray);
        setFirstChannel();
      }
    } catch (err) {
      console.log(err.code);
    }
  }, [channelsRef, setFirstChannel]);

  const changeChannel = (channel) => {
    setActiveChannel(channel.id);
    dispatch(setCurrentChannel(channel));
  };

  useEffect(() => {
    getChannels();
  }, [getChannels]);

  const isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

  const addChannel = async (inputValues) => {
    const { channelName, channelDetails } = inputValues;
    const newChannelKey = push(channelsRef).key;

    const channelData = {
      id: newChannelKey,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: displayName,
        avatar: photoURL
      }
    };
    
    updatesChannels['/channels/' + newChannelKey] = channelData;

    try {
      await update(ref(db), updatesChannels);
      getChannels();
    } catch (err) {
      console.log(err.message);
    } finally {
      setInputValues({});
      setModalOpen(false)
    }
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (isFormValid(inputValues)) {
      addChannel(inputValues);
    }
  };

  const displayChannels = (channels) => channels.map((channel) => (
    <Menu.Item
      key={channel.id}
      onClick={() => changeChannel(channel)}
      name={channel.name}
      style={{ opacity: 0.7 }}
      active={channel.id === activeChannel}
    >
      # {channel.name}
    </Menu.Item>
  ))
  
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

export default Channels
