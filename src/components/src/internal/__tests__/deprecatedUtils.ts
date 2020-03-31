/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {
  convertState,
  warnOnce,
  isInternetReachable,
  isConnectionExpensive,
} from '../deprecatedUtils';
import {
  NetInfoState,
  NetInfoStateType,
  NetInfoCellularGeneration,
} from '../types';
import {NetInfoData} from '../deprecatedTypes';

interface TestCase {
  title: string;
  input: NetInfoState;
  isInternetReachable: boolean;
  isExpensive: boolean;
  depreacted: NetInfoData;
}

describe('Deprecated utils', () => {
  const TEST_CASES: TestCase[] = [
    {
      title: 'None',
      input: {
        type: NetInfoStateType.none,
        isInternetReachable: false,
        isInternetReachable: false,
        details: null,
      },
      isInternetReachable: false,
      isExpensive: false,
      depreacted: {
        type: 'none',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Unknown',
      input: {
        type: NetInfoStateType.unknown,
        isInternetReachable: false,
        isInternetReachable: false,
        details: null,
      },
      isInternetReachable: false,
      isExpensive: false,
      depreacted: {
        type: 'unknown',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Wifi',
      input: {
        type: NetInfoStateType.wifi,
        isInternetReachable: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: false,
        },
      },
      isInternetReachable: true,
      isExpensive: false,
      depreacted: {
        type: 'wifi',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Cellular with generation',
      input: {
        type: NetInfoStateType.cellular,
        isInternetReachable: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: NetInfoCellularGeneration['3g'],
        },
      },
      isInternetReachable: true,
      isExpensive: true,
      depreacted: {
        type: 'cellular',
        effectiveType: '3g',
      },
    },
    {
      title: 'Cellular without generation',
      input: {
        type: NetInfoStateType.cellular,
        isInternetReachable: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: null,
        },
      },
      isInternetReachable: true,
      isExpensive: true,
      depreacted: {
        type: 'cellular',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Bluetooth',
      input: {
        type: NetInfoStateType.bluetooth,
        isInternetReachable: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: false,
        },
      },
      isInternetReachable: true,
      isExpensive: false,
      depreacted: {
        type: 'bluetooth',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Ethernet',
      input: {
        type: NetInfoStateType.ethernet,
        isInternetReachable: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: false,
        },
      },
      isInternetReachable: true,
      isExpensive: false,
      depreacted: {
        type: 'ethernet',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Wimax',
      input: {
        type: NetInfoStateType.wimax,
        isInternetReachable: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: false,
        },
      },
      isInternetReachable: true,
      isExpensive: false,
      depreacted: {
        type: 'wimax',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'VPN',
      input: {
        type: NetInfoStateType.vpn,
        isInternetReachable: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: false,
        },
      },
      isInternetReachable: true,
      isExpensive: false,
      depreacted: {
        type: 'unknown',
        effectiveType: 'unknown',
      },
    },
    {
      title: 'Other',
      input: {
        type: NetInfoStateType.other,
        isInternetReachable: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: false,
        },
      },
      isInternetReachable: true,
      isExpensive: false,
      depreacted: {
        type: 'unknown',
        effectiveType: 'unknown',
      },
    },
  ];

  describe('convertState', () => {
    TEST_CASES.forEach(testCase => {
      it(`should convert the state correctly for ${testCase.title}`, () => {
        expect(convertState(testCase.input)).toEqual(testCase.depreacted);
      });
    });
  });

  describe('isInternetReachable', () => {
    TEST_CASES.forEach(testCase => {
      it(`should return the correct state for ${testCase.title}`, () => {
        expect(isInternetReachable(testCase.input)).toEqual(testCase.isInternetReachable);
      });
    });
  });

  describe('isConnectionExpensive', () => {
    TEST_CASES.forEach(testCase => {
      describe('Android', () => {
        beforeEach(() => {
          jest.mock('Platform', () => {
            const Platform = jest.requireActual('Platform');
            Platform.OS = 'android';
            return Platform;
          });
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        it(`should return the correct state for ${
          testCase.title
        } on Android`, () => {
          expect(isConnectionExpensive(testCase.input)).toEqual(
            testCase.isExpensive,
          );
        });
      });
    });
  });

  describe('warnOnce', () => {
    it('logs warning messages to the console exactly once', () => {
      console.warn = jest.fn();

      warnOnce();
      warnOnce();

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Warning:'),
      );
      expect(console.warn).toHaveBeenCalledTimes(1);
    });
  });
});
