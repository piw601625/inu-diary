import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import colors from '../color';
import { useDB } from '../context';
import { FlatList, LayoutAnimation, UIManager, Platform } from 'react-native';

const View = styled.View`
  flex: 1;
  background-color: ${colors.bgColor};
  padding: 0 50px;
  padding-top: 100px;
`;
const Title = styled.Text`
  color: ${colors.textColor};
  font-size: 38px;
  margin-bottom: 70px;
`;
const JournalList = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;
const Btn = styled.TouchableOpacity`
  position: absolute;
  bottom: 50px;
  right: 50px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.btnColor};
  elevation: 5;
  box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.3);
`;
const BtnText = styled.Text`
  color: white;
`;
const Record = styled.TouchableOpacity`
  background-color: ${colors.cardColor};
  flex-direction: row;
  padding: 10px 20px;
  border-radius: 10px;
  align-items: center;
  flex: 1;
  margin-right: 10px;
`;
const Emotion = styled.Text`
  font-size: 24px;
  margin-right: 10px;
`;
const Message = styled.Text`
  font-size: 18px;
`;
const Seperator = styled.View`
  height: 10px;
`;
const DeleteBtn = styled.TouchableOpacity`
  background-color: #ff3333;
  border-radius: 5px;
`;
const DeleteBtnTxt = styled.Text`
  color: #fff;
`;

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Home = ({ navigation: { navigate } }) => {
  const realm = useDB();
  const [feelings, setFeelings] = useState([]);

  useEffect(() => {
    const feelings = realm.objects('Feeling');
    feelings.addListener((feelings, changes) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setFeelings(feelings.sorted('_id', true));
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, []);

  const onDeletePress = (id) => {
    realm.write(() => {
      const feeling = realm.objectForPrimaryKey('Feeling', id);
      realm.delete(feeling);
    });
  };

  const navigation = useNavigation();
  const goToEdit = (item) => {
    navigation.navigate({
      name: 'Write',
      params: {
        ...item,
      },
    });
  };

  return (
    <View>
      <Title>My journal</Title>
      <FlatList
        data={feelings}
        keyExtractor={(feeling) => feeling._id + ''}
        contentContainerStyle={{ paddingBottom: 50 }}
        ItemSeparatorComponent={Seperator}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <JournalList>
            <Record onPress={() => goToEdit(item)}>
              <Emotion>{item.emotion}</Emotion>
              <Message>
                {item.message.slice(0, 12)}
                {item.message.length > 12 ? '...' : ''}
              </Message>
            </Record>
            <DeleteBtn onPress={() => onDeletePress(item._id)}>
              <DeleteBtnTxt>
                <Ionicons name="close" size={25} color="white" />
              </DeleteBtnTxt>
            </DeleteBtn>
          </JournalList>
        )}
      />
      <Btn onPress={() => navigate('Write')}>
        <BtnText>
          <Ionicons name="add" size={40} color="white" />
        </BtnText>
      </Btn>
    </View>
  );
};

export default Home;
