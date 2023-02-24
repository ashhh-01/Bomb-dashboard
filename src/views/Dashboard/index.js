import React, { useMemo } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet';

import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';

import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import CountUp from 'react-countup';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';

import { roundAndFormatNumber } from '../../0x';
import useBombStats from '../../hooks/useBombStats';
import usebShareStats from '../../hooks/usebShareStats';
import useBondStats from '../../hooks/useBondStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';

import ZapModal from '../Bank/components/ZapModal';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';

// icons

import DocImage from './img/Docimg.png';
import DiscordImage from './img/DCimage.png';
import Metamask from './img/wMetaMask.png';
import Bomb from './img/bomb.png';
import BShare from './img/bshareslg.png';
import BBLP from './img/bomb-bitcoin-LP.png';
import BSLP from './img/bshare-bnb-LP.png';
import Bonds from './img/bbond.png';

import { Box, Typography, Grid, Button } from '@material-ui/core';

import '../../index.css';

import HomeImage from '../../assets/img/background.jpg';

const BackgroundImage = createGlobalStyle`

  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | Dashboard';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  const cashStat = useCashPriceInEstimatedTWAP();

  const { to } = useTreasuryAllocationTimes();
  const currentEpoch = useCurrentEpoch();
  const TVL = useTotalValueLocked();
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);

  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');

  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );

  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );

  const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });

  const [onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'BOMB-BTCB-LP'}
    />,
  );

  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  const Table = () => {
    return (
      <div style={{ width: '600px' }}>
        <table className="TableInfo">
          <thead>
            <tr>
              <th></th>
              <th style={{ whiteSpace: 'nowrap' }}>Current Supply</th>
              <th>Total Supply</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img src={Bomb} alt="" style={{ maxHeight: '20px', padding: '2px' }} />
                $BOMB
              </td>
              <td>{roundAndFormatNumber(bombCirculatingSupply, 2)} </td>
              <td>{roundAndFormatNumber(bombTotalSupply, 2)}</td>
              <td>
                ${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'}
                <br /> {bombPriceInBNB ? bombPriceInBNB : '-.----'} BTCB
              </td>
              <td>
                <img src={Metamask} alt="" style={{ maxHeight: '45px', padding: '2px' }} />
              </td>
            </tr>
            <tr>
              <td style={{ whiteSpace: 'nowrap' }}>
                <img src={BShare} alt="" style={{ maxHeight: '20px', padding: '2px' }} />
                $BSHARE
              </td>
              <td>{roundAndFormatNumber(bShareCirculatingSupply, 2)}</td>
              <td>{roundAndFormatNumber(bShareTotalSupply, 2)}</td>
              <td>
                ${bSharePriceInDollars ? bSharePriceInDollars : '-.--'}
                <br />
                {bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BTCB
              </td>
              <td>
                <img src={Metamask} alt="" style={{ maxHeight: '45px', padding: '2px' }} />
              </td>
            </tr>
            <tr>
              <td>
                <img src={Bomb} alt="" style={{ maxHeight: '20px', padding: '2px' }} />
                $BBOND
              </td>
              <td>{roundAndFormatNumber(tBondCirculatingSupply, 2)}</td>
              <td>{roundAndFormatNumber(tBondTotalSupply, 2)}</td>
              <td>
                ${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}
                <br />
                <span style={{ whiteSpace: 'nowrap' }}>
                  {bombLPStats?.ftmAmount ? bombLPStats?.ftmAmount : '-.--'} BTCB
                </span>
              </td>
              <td>
                <img src={Metamask} alt="" style={{ maxHeight: '45px', padding: '2px' }} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Page>
      <BackgroundImage />
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <div className="dashboard-body">
        <Box className="first-container">
          <h1 className="heading-bomb">Bomb Finance Summary</h1>
          <hr></hr>

          <Grid item lg={12}>
            <Grid container justify="flex-start" spacing={0}>
              <Grid container spacing={1}>
                <Grid item lg={9} style={{ padding: '0px' }}>
                  <Table />
                </Grid>
                <Grid item lg={3}>
                  <div>
                    <Typography align="center" style={{ textTransform: 'uppercase', color: '#ffff', fontSize: '15px' }}>
                      Current Epoch
                    </Typography>
                    <Typography align="center" style={{ color: '#fff', fontSize: '30px', fontWeight: 'bold' }}>
                      {Number(currentEpoch)}
                    </Typography>
                  </div>
                  <div>
                    <Typography align="center" style={{ color: '#fff', fontSize: '40px', fontWeight: 'bold' }}>
                      <ProgressCountdown
                        base={moment().toDate()}
                        hideBar={true}
                        deadline={to}
                        description="Next Epoch"
                      />
                    </Typography>
                    <Typography style={{ textTransform: 'uppercase', color: '#ffff', textAlign: 'center' }}>
                      Next Epoch
                    </Typography>
                  </div>
                  <div>
                    <Typography align="center" style={{ textTransform: 'uppercase', color: '#ffff', fontSize: '15px' }}>
                      Live TWAP:<span style={{ color: '#00E8A2', padding: '3px' }}>{scalingFactor}</span>
                    </Typography>
                    <Typography align="center" style={{ textTransform: 'uppercase', color: '#ffff', fontSize: '15px' }}>
                      TVL:
                      <CountUp style={{ color: '#00E8A2', padding: '3px' }} end={TVL} separator="," prefix="$" />
                    </Typography>

                    <Typography align="center" style={{ textTransform: 'uppercase', color: '#ffff', fontSize: '15px' }}>
                      Last Epoch TWAP:<span style={{ color: '#00E8A2', padding: '3px' }}>1.22</span>
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Box style={{ height: '400px' }}>
          <Grid container justify="flex" spacing={0}>
            {/* Invest Now */}

            <Grid item lg={6}>
              <a
                style={{ color: '#9EE6FF', marginLeft: '360px' }}
                href="https://bombbshare.medium.com/the-bomb-cycle-how-to-print-forever-e89dc82c12e5"
              >
                Read Investment Strategy
              </a>
              <Grid container justify="flex-start" spacing={0}>
                <Button
                  href=""
                  className={'invest-btn ' + classes.button}
                  target="_blank"
                  style={{
                    margin: '5px',
                    width: '565px',
                    color: '#fff',
                    fontWeight: '900',
                    backgroundColor: 'rgba(0, 173, 232,0.5)',
                  }}
                >
                  Invest Now
                </Button>
              </Grid>

              {/* Discord and Doc */}
              <Grid container justify="flex-start" spacing={0}>
                <Button
                  href="https://discord.bomb.money"
                  className={'invest-btn ' + classes.button}
                  target="_blank"
                  style={{
                    margin: '5px',
                    width: '275px',
                    color: '#000000',
                    backgroundColor: 'rgba(255, 255, 255,0.8)',
                  }}
                >
                  <img src={DiscordImage} alt="Bomb.money" style={{ maxHeight: '20px', padding: '2px' }} />
                  Chat on Discord
                </Button>
                <Button
                  href="https://docs.bomb.money"
                  className={'invest-btn ' + classes.button}
                  target="_blank"
                  style={{
                    margin: '5px',
                    width: '280px',
                    color: '#000000',
                    backgroundColor: 'rgba(255, 255, 255,0.8)',
                  }}
                >
                  <img src={DocImage} alt="Bomb.money" style={{ maxHeight: '20px', padding: '2px' }} />
                  Read Docs
                </Button>
              </Grid>

              <Grid container justify="flex-start" spacing={0}>
                <div className="boardroom-board">
                  <Grid container spacing={1}>
                    <Grid item lg={3}>
                      <img
                        src={BShare}
                        alt="Bomb.money"
                        style={{ maxHeight: '240px', padding: '10px', margin: '10px' }}
                      />
                    </Grid>

                    <Grid item lg={6}>
                      <Typography style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginTop: '5px' }}>
                        Boardroom
                        <span>
                          <Button
                            style={{
                              backgroundColor: 'rgba(0, 232, 162,0.5)',
                              color: '#fff',
                              padding: '3px',
                              fontSize: '8px',
                              marginLeft: '2px',
                            }}
                            variant="contained"
                            size="small"
                            color="success"
                          >
                            Recommendation
                          </Button>
                        </span>
                      </Typography>
                      <Typography style={{ color: '#fff', fontSize: '12px', fontWeight: '100' }}>
                        Stake BSHARE and earn BOMB every epoch
                      </Typography>
                    </Grid>

                    <Grid item lg={3}>
                      <Typography style={{ color: '#fff', fontSize: '12px', fontWeight: '100', padding: '35px 0 0 0' }}>
                        TVL: <CountUp style={{ color: '#fff', padding: '3px' }} end={TVL} separator="," prefix="$" />
                      </Typography>
                    </Grid>

                    {/* Daily data */}

                    <Grid item lg={2}>
                      <Typography style={{ color: '#fff', padding: '45px 0 60px 20px' }}>
                        <div style={{ whiteSpace: 'nowrap', fontWeight: '100' }}>Daily Returns:</div>
                        <div style={{ fontSize: '15px' }}>2%</div>{' '}
                      </Typography>
                    </Grid>

                    <Grid item lg={2}>
                      <Typography style={{ color: '#fff', padding: '45px 0 60px 20px', marginLeft: '35px' }}>
                        <div style={{ whiteSpace: 'nowrap', fontWeight: '100' }}>Your Stake:</div>
                        <div style={{ fontSize: '15px', whiteSpace: 'nowrap' }}>
                          <img src={BShare} alt="Bomb.money" style={{ maxHeight: '20px', padding: '2px' }} />
                          6000
                        </div>
                        <div style={{ fontSize: '15px' }}>≈000000</div>
                      </Typography>
                    </Grid>

                    <Grid item lg={2}>
                      <Typography style={{ color: '#fff', padding: '45px 0 60px 20px', marginLeft: '35px' }}>
                        <div style={{ whiteSpace: 'nowrap', fontWeight: '100' }}>Earned:</div>
                        <div style={{ fontSize: '15px', whiteSpace: 'nowrap' }}>
                          <img src={Bomb} alt="Bomb.money" style={{ maxHeight: '20px', padding: '2px' }} />
                          6000
                        </div>
                        <div style={{ fontSize: '15px' }}>≈000000</div>
                      </Typography>
                    </Grid>

                    <Grid item lg={6}>
                      <div style={{ marginLeft: '50px', marginTop: '40px' }}>
                        <Button
                          style={{ color: '#fff', border: '2px solid #fff', borderRadius: '20px' }}
                          variant="outlined"
                        >
                          Deposit
                        </Button>
                        <Button
                          style={{ marginLeft: '10px', color: '#fff', border: '2px solid #fff', borderRadius: '20px' }}
                          variant="outlined"
                        >
                          Withdraw
                        </Button>
                      </div>

                      <div style={{ marginLeft: '50px', marginTop: '10px' }}>
                        <Button
                          style={{
                            whiteSpace: 'nowrap',
                            color: '#fff',
                            border: '2px solid #fff',
                            borderRadius: '20px',
                            padding: '4px 32px 5px 40px',
                          }}
                          variant="outlined"
                        >
                          Claim Reward
                          <img src={BShare} alt="Bomb.money" style={{ maxHeight: '20px', padding: '2px' }} />
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>

            {/* Latest News */}

            <Grid item lg={6}>
              <div className="news-board">
                <span className="news">Latest News</span>
              </div>
            </Grid>
          </Grid>
        </Box>

        {/* bomb farms dashboard */}

        <Grid item lg={12}>
          <Grid container justify="flex-start" spacing={0}>
            <div className="bomb-farms-container">
              <Grid container spacing={1}>
                <Grid item lg={10} style={{ padding: '0px' }}>
                  <Typography style={{ color: '#fff', fontSize: '22px', padding: '10px 0px 0px 25px' }}>
                    Bomb Farms
                  </Typography>
                  <Typography style={{ color: '#fff', fontSize: '12px', padding: '0px 0px 10px 25px' }}>
                    Stake your LP tokens in our farms to start earning $BSHARE
                  </Typography>
                </Grid>

                <Grid item lg={2}>
                  <Button
                    style={{
                      whiteSpace: 'nowrap',
                      color: '#fff',
                      border: '2px solid #fff',
                      borderRadius: '20px',
                      padding: '0px 15px 0px 20px',
                      margin: '30px 0 0 0',
                    }}
                    variant="outlined"
                  >
                    Claim All
                    <img src={BShare} alt="Bomb.money" style={{ maxHeight: '20px', padding: '2px' }} />
                  </Button>
                </Grid>

                {/* BOMB-BTBC board */}

                <Grid item lg={10} style={{ padding: '0px' }}>
                  <Typography style={{ color: '#fff', fontSize: '22px', fontWeight: '100', paddingLeft: '20px' }}>
                    <img src={BBLP} alt="BombLP" style={{ maxHeight: '40px', padding: '2px' }} />
                    BOMB-BTBC
                    <Button
                      style={{
                        backgroundColor: 'rgba(0, 232, 162,0.5)',
                        color: '#fff',
                        padding: '3px',
                        fontSize: '8px',
                        marginLeft: '2px',
                      }}
                      variant="contained"
                      size="small"
                      color="success"
                    >
                      Recommendation
                    </Button>
                  </Typography>
                </Grid>
                <Grid item lg={2}>
                  <Typography style={{ color: '#fff', fontSize: '16px', padding: '10px 0px 0px 25px' }}>
                    TVL: <CountUp style={{ color: '#fff', padding: '3px' }} end={TVL} separator="," prefix="$" />
                  </Typography>
                </Grid>

                <Grid item lg={2}>
                  <Typography style={{ color: '#fff', padding: '0px 0 0px 20px' }}>
                    <div style={{ whiteSpace: 'nowrap', fontWeight: '100' }}>Daily Returns:</div>
                    <div style={{ fontSize: '15px' }}>2%</div>{' '}
                  </Typography>
                </Grid>

                <Grid item lg={2}>
                  <Typography style={{ color: '#fff', padding: '0px 0 0px 20px', marginLeft: '35px' }}>
                    <div style={{ whiteSpace: 'nowrap', fontWeight: '100' }}>Your Stake:</div>
                    <div style={{ fontSize: '15px', whiteSpace: 'nowrap' }}>
                      <img src={BShare} alt="Bomb.money" style={{ maxHeight: '20px', padding: '2px' }} />
                      6000
                    </div>
                    <div style={{ fontSize: '15px' }}>≈000000</div>
                  </Typography>
                </Grid>

                <Grid item lg={2}>
                  <Typography style={{ color: '#fff', padding: '0px 0 0px 20px', marginLeft: '35px' }}>
                    <div style={{ whiteSpace: 'nowrap', fontWeight: '100' }}>Earned:</div>
                    <div style={{ fontSize: '15px', whiteSpace: 'nowrap' }}>
                      <img src={Bomb} alt="Bomb.money" style={{ maxHeight: '20px', padding: '2px' }} />
                      6000
                    </div>
                    <div style={{ fontSize: '15px' }}>≈000000</div>
                  </Typography>
                </Grid>

                <Grid item lg={6}>
                  <div style={{ marginLeft: '130px', marginTop: '40px' }}>
                    <Button
                      style={{ color: '#fff', border: '2px solid #fff', borderRadius: '20px' }}
                      variant="outlined"
                    >
                      Deposit
                    </Button>
                    <Button
                      style={{ marginLeft: '15px', color: '#fff', border: '2px solid #fff', borderRadius: '20px' }}
                      variant="outlined"
                    >
                      Withdraw
                    </Button>
                    <Button
                      style={{
                        whiteSpace: 'nowrap',
                        color: '#fff',
                        border: '2px solid #fff',
                        borderRadius: '20px',
                        padding: '4px 32px 5px 40px',
                        marginLeft: '15px',
                      }}
                      variant="outlined"
                    >
                      Claim Reward
                      <img src={BShare} alt="Bomb.money" style={{ maxHeight: '20px', padding: '2px' }} />
                    </Button>
                  </div>
                </Grid>

                {/* BSHARE-BNB board*/}

                <Grid item lg={10} style={{ padding: '0px' }}>
                  <Typography style={{ color: '#fff', fontSize: '22px', fontWeight: '100', paddingLeft: '20px' }}>
                    <img src={BSLP} alt="BombLP" style={{ maxHeight: '40px', padding: '0px' }} />
                    BSHARE-BNB
                    <Button
                      style={{
                        backgroundColor: 'rgba(0, 232, 162,0.5)',
                        color: '#fff',
                        padding: '3px',
                        fontSize: '8px',
                        marginLeft: '2px',
                      }}
                      variant="contained"
                      size="small"
                      color="success"
                    >
                      Recommendation
                    </Button>
                  </Typography>
                </Grid>
                <Grid item lg={2}>
                  <Typography style={{ color: '#fff', fontSize: '16px', padding: '10px 0px 0px 25px' }}>
                    TVL: <CountUp style={{ color: '#fff', padding: '3px' }} end={TVL} separator="," prefix="$" />
                  </Typography>
                </Grid>

                <Grid item lg={2}>
                  <Typography style={{ color: '#fff', padding: '0px 0 0px 20px' }}>
                    <div style={{ whiteSpace: 'nowrap', fontWeight: '100' }}>Daily Returns:</div>
                    <div style={{ fontSize: '15px' }}>2%</div>{' '}
                  </Typography>
                </Grid>

                <Grid item lg={2}>
                  <Typography style={{ color: '#fff', padding: '0px 0 0px 20px', marginLeft: '35px' }}>
                    <div style={{ whiteSpace: 'nowrap', fontWeight: '100' }}>Your Stake:</div>
                    <div style={{ fontSize: '15px', whiteSpace: 'nowrap' }}>
                      <img src={BShare} alt="Bomb.money" style={{ maxHeight: '20px', padding: '2px' }} />
                      6000
                    </div>
                    <div style={{ fontSize: '15px' }}>≈000000</div>
                  </Typography>
                </Grid>

                <Grid item lg={2}>
                  <Typography style={{ color: '#fff', padding: '0px 0 0px 20px', marginLeft: '35px' }}>
                    <div style={{ whiteSpace: 'nowrap', fontWeight: '100' }}>Earned:</div>
                    <div style={{ fontSize: '15px', whiteSpace: 'nowrap' }}>
                      <img src={Bomb} alt="Bomb.money" style={{ maxHeight: '20px', padding: '2px' }} />
                      6000
                    </div>
                    <div style={{ fontSize: '15px' }}>≈000000</div>
                  </Typography>
                </Grid>

                <Grid item lg={6}>
                  <div style={{ marginLeft: '130px', marginTop: '40px' }}>
                    <Button
                      style={{ color: '#fff', border: '2px solid #fff', borderRadius: '20px' }}
                      variant="outlined"
                    >
                      Deposit
                    </Button>
                    <Button
                      style={{ marginLeft: '15px', color: '#fff', border: '2px solid #fff', borderRadius: '20px' }}
                      variant="outlined"
                    >
                      Withdraw
                    </Button>
                    <Button
                      style={{
                        whiteSpace: 'nowrap',
                        color: '#fff',
                        border: '2px solid #fff',
                        borderRadius: '20px',
                        padding: '4px 32px 5px 40px',
                        marginLeft: '15px',
                      }}
                      variant="outlined"
                    >
                      Claim Reward
                      <img src={BShare} alt="Bomb.money" style={{ maxHeight: '20px', padding: '2px' }} />
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>

        {/* Bonds board */}
        <Grid item lg={12}>
          <Grid container justify="flex-start" spacing={0}>
            <div className="bonds-container">
              <Grid container spacing={1}>
                <Grid item lg={1} style={{ padding: '0px', margin: '0px' }}>
                  <img src={Bonds} alt="Bonds" style={{ maxHeight: '240px', padding: '10px', margin: '15px' }} />
                </Grid>
                <Grid item lg={11}>
                  <Typography style={{ color: '#fff', fontSize: '22px', padding: '10px 0px 0px 0px' }}>
                    Bonds
                  </Typography>
                  <Typography style={{ color: '#fff', fontSize: '12px', padding: '10px 0px 0px 0px' }}>
                    BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1
                  </Typography>
                </Grid>
                <Grid item lg={3}>
                  <Typography style={{ padding: '0 0 0 25px', color: '#fff', fontSize: '16px', fontWeight: '100px' }}>
                    Current Price: (Bomb)^2
                  </Typography>
                  <Typography style={{ padding: '0 0 0 25px', color: '#fff', fontSize: '20px' }}>
                    BBond = 6.2872 BTCB
                  </Typography>
                </Grid>
                <Grid item lg={3}>
                  <Typography style={{ padding: '0 0 0 25px', color: '#fff', font: '16px', fontWeight: '100px' }}>
                    Available to redeem:{' '}
                  </Typography>
                  <Typography>
                    <img src={Bonds} alt="Bonds" style={{ maxHeight: '240px' }} />
                    <span style={{ paddingBottom: '30px', color: '#fff', fontSize: '20px' }}>456</span>
                  </Typography>
                </Grid>
                <Grid item lg={4}>
                  <Typography style={{ padding: '0 0 0 125px', color: '#fff', font: '16px', fontWeight: '100px' }}>
                    Purchase BBond
                  </Typography>
                  <Typography style={{ padding: '0 0px 10px 125px', color: '#fff', font: '16px', fontWeight: '100px' }}>
                    Bomb is over peg
                  </Typography>
                  <Typography style={{ padding: '0 0 0 125px', color: '#fff', font: '16px', fontWeight: '100px' }}>
                    Redeem Bomb
                  </Typography>
                </Grid>
                <Grid item lg={2}>
                  <Typography>
                    <Button
                      style={{
                        color: 'rgba(128, 128, 128)',
                        border: '2px solid rgba(128, 128, 128)',
                        borderRadius: '20px',
                        marginBottom: '10px',
                        fontSize: '10px',
                        backgroundColor: 'transparent',
                      }}
                      variant="contained"
                      disabled
                    >
                      Purchase
                    </Button>
                  </Typography>
                  <Typography>
                    <Button
                      style={{
                        color: '#fff',
                        border: '2px solid #fff',
                        borderRadius: '20px',
                        marginBottom: '5px',
                        fontSize: '10px',
                      }}
                      variant="outlined"
                    >
                      Redeem Now
                    </Button>
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
    </Page>
  );
};

export default Dashboard;
