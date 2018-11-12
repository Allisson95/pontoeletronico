import React, { Component } from 'react';
import { Alert, AsyncStorage, Platform, StyleSheet } from 'react-native';
import {
  Body,
  Button,
  CheckBox,
  Container,
  Content,
  Footer,
  FooterTab,
  Form,
  Icon,
  Input,
  ListItem,
  Item,
  Picker,
  Text,
  View,
  Thumbnail,
} from 'native-base';

import dJSON from 'dirty-json';
import moment from 'moment';

import StefaniniApi from '../../service/StefaniniApi';

const STORE_KEY = '@ELETRONIC_POINT_STEFANINI:USER_PREFERENCES';

const MESSAGE_TYPES = {
  tmNormal: 0,
  tmOk: 1,
  tmErro: 2,
  tmAtencao: 3,
};

/**
 * Tela do relógio de registro de ponto.
 *
 * @author Allisson Nunes - Matrícula: 62021
 */
class Home extends Component {
  constructor(props) {
    super(props);
    this.stefaniniApi = new StefaniniApi();

    this.functions = [
      { label: '1 - Ponto Eletrônico', value: '1' },
      { label: '2 - Pausa NR Call Center', value: '2' },
    ];

    this.virtualClocks = [
      {
        deviceID: 8002,
        deviceTitle: 'Horário de Brasilia',
      },
      {
        deviceID: 8003,
        deviceTitle: 'UTC-4 (Horario Amazonia)',
      },
      {
        deviceID: 8009,
        deviceTitle: 'UTC-2 (Horario Ilhas)',
      },
      {
        deviceID: 8010,
        deviceTitle: 'UTC-5 (Horario Acre)',
      },
    ];

    this.state = {
      selectedFunction: '1',
      deviceID: '8002',
      dateTime: moment(),
      passwordHidden: true,
      username: '',
      password: '',
      saveUserAndPass: false,
      captcha: '',
      captchaSource:
        'data:image/png;base64,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',
      crachaCt: '',
      userNameCt: '',
      passwordCt: '',
      leaveCt: '',
      costCenterCt: '',
      funcCt: '',
    };
  }

  componentWillMount = () => {
    this.initScreen();
  };

  initScreen = () => {
    this.loadClock();
    this.loadUserPreferences();
  };

  componentDidMount = () => {
    setInterval(this.refreshDateTime, 1000);
  };

  /**
   * Atualiza o relogio exibido na tela.
   * @memberof Home
   */
  refreshDateTime = () => {
    const { dateTime } = this.state;
    this.setState({
      dateTime: dateTime.add(1, 's'),
    });
  };

  /**
   * Atualiza a função selecionada.
   * @param {string} - Função selecionada.
   * @memberof Home
   */
  onFunctionSelected = selectedFunction => {
    this.setState({
      selectedFunction,
    });
  };

  /**
   * Atualiza o campo de usuário.
   * @param {string} - Usuário digitado.
   * @memberof Home
   */
  onUsernameChange = username => {
    this.setState({
      username,
    });
  };

  /**
   * Atualiza o campo de senha.
   * @param {string} - Senha digitada.
   * @memberof Home
   */
  onPasswordChange = password => {
    this.setState({
      password,
    });
  };

  /**
   * Atualiza o campo de captcha.
   * @param {string} - Captcha digitado.
   * @memberof Home
   */
  onCaptchaChange = captcha => {
    this.setState({
      captcha,
    });
  };

  /**
   * Cria os itens selecionáveis do Picker de seleção de função.
   * @returns {Picker.Item} - Retorna um array de itens selecionáveis.
   * @memberof Home
   */
  renderPickerItems = () =>
    this.functions.map((func, index) => (
      <Picker.Item key={index} label={func.label} value={func.value} />
    ));

  /**
   * Altera o estado do olho, exibindo a senha ou não.
   * @memberof Home
   */
  togglePasswordVisibility = () => {
    this.setState({ passwordHidden: !this.state.passwordHidden });
  };

  /**
   * Altera o estado da flag saveUserAndPass.
   * @memberof Home
   */
  toggleCheckSaveUserAndPass = () => {
    this.setState({ saveUserAndPass: !this.state.saveUserAndPass });
  };

  /**
   * Carrega da memória do dispositivo os dados de usuário salvo, se houver.
   * @memberof Home
   */
  loadUserPreferences = async () => {
    try {
      let USER_PREFERENCES = await AsyncStorage.getItem(STORE_KEY);
      if (USER_PREFERENCES) {
        const { username, password, saveUserAndPass } = JSON.parse(
          USER_PREFERENCES
        );
        this.setState({
          username,
          password,
          saveUserAndPass,
        });
      }
    } catch (error) {}
  };

  /**
   * Salva na memória do dispositivo os dados de usuário.
   * @async
   * @memberof Home
   */
  saveUserPreferences = async () => {
    try {
      const { username, password, saveUserAndPass } = this.state;
      const USER_PREFERENCES = {
        username,
        password,
        saveUserAndPass,
      };
      await AsyncStorage.setItem(STORE_KEY, JSON.stringify(USER_PREFERENCES));
    } catch (error) {}
  };

  /**
   * Reseta da memória do dispositivo os dados de usuário salvo.
   * @async
   * @memberof Home
   */
  resetUserPreferences = async () => {
    try {
      await AsyncStorage.removeItem(STORE_KEY);
    } catch (error) {}
  };

  /**
   * Carrega as informações do relógio selecionado.
   * @async
   * @memberof Home
   */
  loadClock = () => {
    this.stefaniniApi
      .getClockDeviceInfo(this.state.deviceID)
      .then(response => response.data)
      .then(response => {
        const result = JSON.parse(
          JSON.stringify(
            dJSON.parse(response.replace(/(new Date\([0-9,]+\))/, '"$1"'))
          )
        );
        const {
          useCracha,
          useUserPwd,
          oplLiberarFolhaRVirtual,
          oplLiberarCCustoRVirtual,
          oplLiberarFuncoesRVirtual,
          dtTimeEvent,
        } = result.deviceInfo;
        const [y, M, d, h, m, s] = dtTimeEvent
          .replace(/[^0-9,]+/, '')
          .split(',');
        const clockTime = moment({ y, M, d, h, m, s });
        this.setState({
          crachaCt: useCracha,
          userNameCt: useUserPwd,
          passwordCt: useUserPwd,
          leaveCt: oplLiberarFolhaRVirtual,
          costCenterCt: oplLiberarCCustoRVirtual,
          funcCt: oplLiberarFuncoesRVirtual,
          dateTime: clockTime,
        });
      })
      .then(this.loadCaptcha());
  };

  /**
   * Carrega a imagem captcha retornada da api.
   * @async
   * @memberof Home
   */
  loadCaptcha = () => {
    this.stefaniniApi
      .getCaptcha(this.state.deviceID)
      .then(response => response.data)
      .then(async response => {
        const { urlcaptcha } = response;
        this.setState({
          captchaSource: urlcaptcha,
          captcha: '',
        });
      });
  };

  /**
   * Recarrega a imagem captcha retornada da api.
   * @async
   * @memberof Home
   */
  reloadCaptcha = () => {
    this.loadCaptcha();
  };

  /**
   * Realiza a ação de registrar o ponto do colaborador.
   * @async
   * @memberof Home
   */
  onPressRegister = () => {
    const {
      deviceID,
      selectedFunction,
      username,
      password,
      saveUserAndPass,
      captcha,
    } = this.state;
    if (saveUserAndPass) {
      this.saveUserPreferences();
    } else {
      this.resetUserPreferences();
    }
    this.stefaniniApi
      .markEletronicPoint(
        deviceID,
        selectedFunction,
        username,
        password,
        captcha
      )
      .then(response => response.data)
      .then(response => {
        const result = JSON.parse(JSON.stringify(dJSON.parse(response)));
        if (result.success) {
          this.showAlert(result.msg.msg, result.msg.type);
        } else {
          this.showAlert(
            result.error.replace('Texto', 'O Captcha'),
            MESSAGE_TYPES.tmErro
          );
        }
        this.loadCaptcha();
      })
      .catch(() => {
        this.loadCaptcha();
      });
  };

  /**
   * Exibe um alerta com as mensagens extraídas do endpoint.
   * @memberof Home
   */
  showAlert = (msg, type) => {
    let alertTitle;
    switch (type) {
      case MESSAGE_TYPES.tmOK:
        alertTitle = 'Sucesso';
        break;
      case MESSAGE_TYPES.tmErro:
        alertTitle = 'Erro';
        break;
      case MESSAGE_TYPES.tmAtencao:
        alertTitle = 'Atenção';
        break;
      default:
        alertTitle = 'Atenção';
        break;
    }
    if (msg.includes('Usuário / Senha')) {
      msg = 'Usuário e/ou Senha Inválidos!';
    }
    Alert.alert(
      alertTitle,
      msg,
      [
        {
          text: 'OK',
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  };

  renderItemClock = clock => {
    const { dateTime } = this.state;
    const date = dateTime.format('DD/MM/YYYY');
    const time = dateTime.format('HH:mm:ss');
    return (
      <View style={styles.dateTimeInfoContainer}>
        <View style={styles.dateTimeInfoBox}>
          <Text style={styles.dateTimeInfoTextStyle}>{clock.deviceTitle}</Text>
          <Text style={styles.dateTimeInfoTextStyle}>{date}</Text>
          <Text style={styles.dateTimeInfoTextStyle}>{time}</Text>
        </View>
      </View>
    );
  };

  render = () => {
    const { dateTime } = this.state;
    const date = dateTime.format('DD/MM/YYYY');
    const time = dateTime.format('HH:mm:ss');
    return (
      <Container style={styles.container}>
        <Content>
          <Form>
            <View style={styles.dateTimeInfoContainer}>
              <View style={styles.dateTimeInfoBox}>
                <Text style={styles.dateTimeInfoTextStyle}>
                  Horário de Brasília
                </Text>
                <Text style={styles.dateTimeInfoTextStyle}>{date}</Text>
                <Text style={styles.dateTimeInfoTextStyle}>{time}</Text>
              </View>
            </View>
            <Item regular picker style={styles.formItem}>
              <Picker
                mode="dialog"
                iosIcon={
                  <Icon
                    name="ios-arrow-down-outline"
                    style={{ color: '#FFFFFF' }}
                  />
                }
                placeholder="Selecione a Função"
                placeholderIconColor="#FFFFFF"
                placeholderStyle={{ color: '#FFFFFF' }}
                style={
                  Platform.OS !== 'ios'
                    ? { color: '#FFFFFF' }
                    : { width: '89%' }
                }
                textStyle={{ color: '#FFFFFF' }}
                selectedValue={this.state.selectedFunction}
                onValueChange={this.onFunctionSelected.bind(this)}
              >
                {this.renderPickerItems()}
              </Picker>
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                style={styles.input}
                placeholder="Usuário"
                placeholderTextColor="#FFFFFF"
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.username}
                onChangeText={this.onUsernameChange.bind(this)}
              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#FFFFFF"
                secureTextEntry={this.state.passwordHidden}
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.password}
                onChangeText={this.onPasswordChange.bind(this)}
              />
              <Icon
                type="FontAwesome"
                name={this.state.passwordHidden ? 'eye-slash' : 'eye'}
                style={{ color: '#FFFFFF' }}
                onPress={this.togglePasswordVisibility}
              />
            </Item>
            <ListItem noBorder>
              <CheckBox
                checked={this.state.saveUserAndPass}
                color="#084f9b"
                onPress={this.toggleCheckSaveUserAndPass}
              />
              <Body>
                <Text>Salvar usuário e senha</Text>
              </Body>
            </ListItem>
            <View style={styles.captchaContainer}>
              <Thumbnail
                style={styles.captchaImage}
                square
                large
                source={{ uri: this.state.captchaSource }}
              />
              <Icon
                style={styles.captchaIcon}
                type="FontAwesome"
                name="repeat"
                onPress={this.reloadCaptcha}
              />
            </View>
            <Item regular style={styles.formItem}>
              <Input
                style={styles.input}
                placeholder="Captcha"
                placeholderTextColor="#FFFFFF"
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.captcha}
                onChangeText={this.onCaptchaChange.bind(this)}
                maxLength={4}
              />
            </Item>
          </Form>
        </Content>
        <Footer>
          <FooterTab>
            <Button
              full
              icon
              style={{ backgroundColor: '#084f9b' }}
              onPress={this.onPressRegister}
            >
              <Icon
                style={{ color: '#FFFFFF' }}
                type="FontAwesome"
                name="check"
              />
              <Text style={{ fontSize: 14, color: '#FFFFFF' }}>REGISTRAR</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  };
}

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  formItem: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5,
    borderColor: '#084f9b',
    backgroundColor: '#1f1f1f',
  },
  input: {
    color: '#FFFFFF',
  },
  dateTimeInfoContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 15,
  },
  dateTimeInfoBox: {
    flex: 1,
    alignItems: 'center',
    width: 200,
  },
  dateTimeInfoTextStyle: {
    fontSize: 20,
    color: '#084f9b',
    fontWeight: 'bold',
  },
  captchaContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  captchaImage: {
    width: 200,
  },
  captchaIcon: {
    marginLeft: 10,
    alignSelf: 'center',
    color: '#084f9b',
  },
});
