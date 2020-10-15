import React from "react";

import useCurrentUser from "hooks/useCurrentUser";
import useDialog from "hooks/useDialog";

import { Grid, Typography, Button, Card, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

import AuthForm from "components/AuthForm";

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
  container: {
    paddingBottom: spacing(4),
    paddingTop: spacing(3),
    textAlign: "center",
    [breakpoints.up("sm")]: {
      paddingBottom: spacing(5),
    },
  },
  subheading: {
    color: palette.secondary.main,
    marginTop: spacing(1),
  },
  ctaButton: {
    marginTop: spacing(3),
  },
  sellingPoint: {
    marginTop: spacing(4),
    textAlign: "center",
    width: 200,
    [breakpoints.down("sm")]: {
      marginBottom: 0,
    },
  },
  detailsContainer: {
    marginTop: spacing(6),
    padding: spacing(3),
    textAlign: "left",
    width: "100%",
    [breakpoints.up("sm")]: {
      width: "90%",
    },
    [breakpoints.up("md")]: {
      width: "75%",
    },
  },
  introLetter: {
    marginTop: spacing(6),
    paddingBottom: spacing(7),
    textAlign: "left",
  },
  introLetterTitle: {
    marginBottom: spacing(3),
  },
  divider: {
    borderBottom: `1px solid ${grey[400]}`,
    height: 1,
    width: "100%",
    [breakpoints.up("sm")]: {
      width: "95%",
    },
    [breakpoints.up("md")]: {
      width: "45%",
    },
  },
}));

const ProjectOverviewSplash = () => {
  const classes = useStyles();

  const [, currentUserQuery] = useCurrentUser();
  const [AuthDialog, setAuthDialogIsVisible] = useDialog();

  const onAuthSuccess = () => {
    currentUserQuery.refetch();
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.container}
      >
        <Typography variant="h1">Monetize your live streams</Typography>
        <Typography variant="h6" className={classes.subheading}>
          An open source project from the co-founder of Concert Window
        </Typography>
        <Button
          onClick={() => setAuthDialogIsVisible(true)}
          color="primary"
          variant="contained"
          size="large"
          className={classes.ctaButton}
        >
          Sign up
        </Button>
        <Grid
          item
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Typography variant="h6" className={classes.sellingPoint}>
            Play a<br />
            show
          </Typography>
          <Typography variant="h6" className={classes.sellingPoint}>
            Fans pay what
            <br />
            they want
          </Typography>
          <Typography variant="h6" className={classes.sellingPoint}>
            Get paid directly to
            <br />
            your bank account
          </Typography>
        </Grid>
        <Card elevation={3} className={classes.detailsContainer}>
          <Typography color="secondary">
            • Broadcast from your laptop, tablet, or smartphone
            <br />
            • Adaptive streaming to viewers means your video will automatically
            optimize for smooth playback
            <br />
            • The project is completely free to use – you keep 80% of revenue
            after payment processing fees (2.9% + $0.30 per transaction)
            <br />• You own all the transaction data and can export it anytime
            via your own Stripe dashboard
          </Typography>
        </Card>
        <Grid
          container
          item
          xs={11}
          sm={9}
          md={7}
          className={classes.introLetter}
        >
          <Typography variant="h6" className={classes.introLetterTitle}>
            Why am I doing this?
          </Typography>
          <Typography color="secondary">
            I was crushed when Concert Window went out of business. We had
            created such a cool community and people really depended on it. When
            the company died, it all disappeared.
            <br />
            <br />
            Then the coronavirus hit. If only we had made it long enough! People
            needed Concert Window like never before.
            <br />
            <br />
            Since the demise of Concert Window, I learned how to code and I’m
            now a full time software engineer. As a personal challenge – and as
            a way to stave off lockdown boredom – I decided to see if I could
            rebuild Concert Window from scratch and publish the source code to
            the community.
            <br />
            <br />
            Now this tool will <em>always</em> be available to people no matter
            what happens.
            <br />
            <br />
            I want to run this as a sustainable project for the community, and
            to do that I need your help. If you would like to participate,
            here’s how:
            <br />
            <br />- If you’re a musician, play shows!
            <br />
            - If you’re a fan, watch shows and support the artists
            <br />- If you’d like to help others, solve people’s support
            questions on{" "}
            <Link href="https://github.com/dgurns/gig-window" target="_blank">
              Github
            </Link>{" "}
            or in live chat during shows
            <br />- If you’re a coder or a musician who wants to become one,
            submit a pull request or bug report on{" "}
            <Link href="https://github.com/dgurns/gig-window" target="_blank">
              Github
            </Link>
            . One of my goals is to help musicians upskill and I pledge to spend
            extra time helping musicians who want to learn how to code.
            <br />
            <br />
            Thank you!
            <br />
            Dan Gurney, creator
          </Typography>
        </Grid>
        <div className={classes.divider} />
      </Grid>

      <AuthDialog>
        <AuthForm showSignUpFirst onSuccess={onAuthSuccess} />
      </AuthDialog>
    </>
  );
};

export default ProjectOverviewSplash;
