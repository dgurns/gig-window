import Cookies from 'js-cookie';
import addMinutes from 'date-fns/addMinutes';
import addHours from 'date-fns/addHours';

interface UseFreePreviewArgs {
  userUrlSlug?: string;
}

interface UseFreePreviewReturnValue {
  freePreviewIsUsed: boolean;
  freePreviewExpiryDate: string | undefined;
  setFreePreviewExpiryDate: () => void;
}

const useFreePreview = ({
  userUrlSlug,
}: UseFreePreviewArgs = {}): UseFreePreviewReturnValue => {
  if (!Cookies.getJSON('freePreview')) {
    Cookies.set('freePreview', {}, { expires: 7 });
  }

  if (!userUrlSlug) {
    return {
      freePreviewIsUsed: false,
      freePreviewExpiryDate: undefined,
      setFreePreviewExpiryDate: () => {},
    };
  }

  const existingCookie = Cookies.getJSON('freePreview');
  const existingExpiryDate = existingCookie[userUrlSlug];

  const FREE_PREVIEW_LENGTH_MINUTES = 5;
  const setFreePreviewExpiryDate = () => {
    if (existingExpiryDate) {
      return;
    }
    return Cookies.set('freePreview', {
      [userUrlSlug]: addMinutes(new Date(), FREE_PREVIEW_LENGTH_MINUTES),
    });
  };

  if (!existingExpiryDate) {
    return {
      freePreviewIsUsed: false,
      freePreviewExpiryDate: undefined,
      setFreePreviewExpiryDate,
    };
  }

  const FREE_PREVIEW_VALIDITY_PERIOD_HOURS = 4;
  const freePreviewValidityThreshold = addHours(
    new Date(existingExpiryDate),
    FREE_PREVIEW_VALIDITY_PERIOD_HOURS
  );
  const now = new Date();
  if (now < new Date(existingExpiryDate)) {
    // Free preview has not been used yet
    return {
      freePreviewIsUsed: false,
      freePreviewExpiryDate: existingExpiryDate,
      setFreePreviewExpiryDate,
    };
  } else if (
    now > new Date(existingExpiryDate) &&
    now < freePreviewValidityThreshold
  ) {
    // Free preview is used, and still valid
    return {
      freePreviewIsUsed: true,
      freePreviewExpiryDate: existingExpiryDate,
      setFreePreviewExpiryDate,
    };
  } else {
    // Free preview is used and no longer valid
    Cookies.set('freePreview', {
      [userUrlSlug]: undefined,
    });
    return {
      freePreviewIsUsed: false,
      freePreviewExpiryDate: undefined,
      setFreePreviewExpiryDate,
    };
  }
};

export default useFreePreview;
