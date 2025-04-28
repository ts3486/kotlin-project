import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  AddLibrary: undefined;
  Test: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type AddLibraryScreenProps = NativeStackScreenProps<RootStackParamList, 'AddLibrary'>;
export type TestScreenProps = NativeStackScreenProps<RootStackParamList, 'Test'>; 