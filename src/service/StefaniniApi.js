import Axios from 'axios';

const Api = Axios.create({
  baseURL: 'http://horas.stefanini.com/.net/index.ashx/',
  withCredentials: true,
});

/**
 * Classe de serviço da api de ponto da Stefanini.
 *
 * @author Allisson Nunes - Matrícula: 62021
 */
class StefaniniApi {
  /**
   * Requisita um código captcha da api.
   *
   * @param {number} deviceID Código do relógio.
   *
   * @returns {Promise} Retorna uma promise com a requisição configurada.
   *
   * @memberof StefaniniApi
   */
  getCaptcha = deviceID => {
    let data = new FormData();
    data.append('deviceID', deviceID);
    data.append('dtFmt', 'd/m/Y');
    data.append('dtTmFmt', 'd/m/Y H:i:s');
    data.append('language', '0');
    data.append('selectedCandidate', '0');
    data.append('selectedEmployee', '0');
    data.append('selectedVacancy', '0');
    data.append('sessionID', '0');
    data.append('shTmFmt', 'H:i');
    data.append('tmFmt', 'H:i:s');
    return Api.post('getCaptcha', data);
  };

  /**
   * Requisita as informações do relogio.
   *
   * @param {number} deviceID Código do relógio.
   *
   * @returns {Promise} Retorna uma promise com a requisição configurada.
   *
   * @memberof StefaniniApi
   */
  getClockDeviceInfo = deviceID => {
    return Api.get('GetClockDeviceInfo', { params: { deviceID } });
  };

  /**
   * Registra o ponto do colaborador.
   *
   * @param {number} deviceID Código do relógio.
   * @param {number} func Função: 1 - Para registro do ponto eletrônico; 2 - Para registro de pausa NR para Call Center.
   * @param {string} userName Matrícula do colaborador.
   * @param {string} password Senha do colaborador.
   * @param {string} captcha Código captcha.
   *
   * @returns {Promise} Retorna uma promise com a requisição configurada.
   *
   * @memberof StefaniniApi
   */
  markEletronicPoint = (deviceID, func, userName, password, captcha) => {
    let data = new FormData();
    data.append('costCenter', '');
    data.append('cracha', '');
    data.append('deviceID', deviceID);
    data.append('dtFmt', 'd/m/Y');
    data.append('dtTmFmt', 'd/m/Y H:i:s');
    data.append('eventType', '1');
    data.append('language', '0');
    data.append('leave', '');
    data.append('selectedCandidate', '0');
    data.append('selectedEmployee', '0');
    data.append('selectedVacancy', '0');
    data.append('sessionID', '0');
    data.append('shTmFmt', 'H:i');
    data.append('tmFmt', 'H:i:s');
    data.append('func', func);
    data.append('userName', userName);
    data.append('password', password);
    data.append('captcha', captcha);
    return Api.post('SaveTimmingEvent', data);
  };
}

export default StefaniniApi;
