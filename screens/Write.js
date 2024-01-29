import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import colors from '../color';
import { Alert } from 'react-native';
import { useDB } from '../context';

const View = styled.View`
  flex: 1;
  background-color: ${colors.bgColor};
  padding: 0 30px;
`;
const Title = styled.Text`
  color: ${colors.textColor};
  margin: 50px 0;
  text-align: center;
  font-size: 28px;
  font-weight: 500;
`;
const TextInput = styled.TextInput`
  background-color: white;
  border-radius: 50px;
  padding: 10px 20px;
  font-size: 18px;
`;
const Btn = styled.TouchableOpacity`
  width: 100%;
  margin-top: 30px;
  padding: 10px 20px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: ${colors.btnColor};
`;
const BtnText = styled.Text`
  color: white;
  font-weight: 500;
  font-size: 18px;
`;
const Emotions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;
const Emotion = styled.TouchableOpacity`
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  padding: 8px;
  border-width: 2px;
  border-color: ${(props) =>
    props.selected ? 'rgba(0, 0, 0, 0.5)' : 'transparent'};
`;
const EmotionText = styled.Text`
  text-align: center;
  font-size: 20px;
`;

const emotions = ['🤯', '🤬', '🤗', '🥰', '😊', '🤩'];

const Write = ({ navigation: { goBack }, route: { params } }) => {
  const realm = useDB();

  const [selectedEmotion, setEmotion] = useState(null);
  const [feelings, setFeelings] = useState('');

  const onChangeText = (text) => setFeelings(text);
  const onEmotionPress = (face) => setEmotion(face);
  const onSubmit = () => {
    if (feelings === '' || selectedEmotion == null) {
      return Alert.alert('Please complete form');
    }

    if (params) {
      const feeling = realm.objectForPrimaryKey('Feeling', params._id);

      realm.write(() => {
        feeling.emotion = selectedEmotion;
        feeling.message = feelings;
      });
    } else {
      realm.write(() => {
        realm.create('Feeling', {
          _id: Date.now(),
          emotion: selectedEmotion,
          message: feelings,
        });
      });
    }

    goBack();
  };

  useEffect(() => {
    if (params) {
      setEmotion(params.emotion);
      setFeelings(params.message);
    }
  }, [params]);

  return (
    <View>
      <Title>How do you feel today</Title>
      <Emotions>
        {emotions.map((emotion, index) => (
          <Emotion
            selected={emotion === selectedEmotion}
            onPress={() => onEmotionPress(emotion)}
            key={index}>
            <EmotionText>{emotion}</EmotionText>
          </Emotion>
        ))}
      </Emotions>
      <TextInput
        returnKeyLabel="done"
        onSubmitEditing={onSubmit}
        value={feelings}
        onChangeText={onChangeText}
        placeholder="Write your feelings..."
      />
      <Btn onPress={onSubmit}>
        <BtnText>Save</BtnText>
      </Btn>
    </View>
  );
};

export default Write;
