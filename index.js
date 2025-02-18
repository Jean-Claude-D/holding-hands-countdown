const SECOND_MILLI = 1000;
const MINUTE_MILLI = SECOND_MILLI * 60;
const HOUR_MILLI = MINUTE_MILLI * 60;
const DAY_MILLI = HOUR_MILLI * 24;
const WEEK_MILLI = DAY_MILLI * 7;

const EST_TIMEZONE = "-05:00";
const JST_TIMEZONE = "+09:00";
const LANDING_DATE = new Date("2025-03-21T15:00" + JST_TIMEZONE);

const timerDisplayElement = document.querySelector("#timer-display");
const untilElement = document.querySelector("#until");
const fullTimerDisplayElement = document.querySelector("#full-timer-display");

// <time> until ...
const events = [
  "I get to see you again", "I can kiss you again", "we can hold hands again",
  "we can hug", "I land in Tokyo", "you can make fun of my Pyjamas",
  "I may see your cute face", "I can hold you in my arms", "we can cuddle",
  "I win at Badminton", "I can tickle you", "we can share a meal together",
  "you lose your water bottle again", "I can fall asleep with you",
  "I can cook for you again", "we can drink together (but not too much)",
  "we can listen to music together", "we can watch our movies together",
  "we can whisper to each other again", "I can sleep on the floor",
  "I can tell you how much I love you", "you show me how to do yoga",
  "I bring you back your diapers", "I can taste your spicy tofu pieces",
  "I can give you a good massage", "you inevitably notice me first, in the airport",
];

/**
 * 
 * @param {any[]} arr 
 */
function chooseInArray(arr) {
  const index = Math.floor(Math.random() * arr.length);

  return arr[index];
}

untilElement.textContent = `Until ${chooseInArray(events)}`;

let updateTimerIntervalId = setInterval(updateTimer, 10);

function updateTimer() {
  if ((new Date()) >= LANDING_DATE) {
    timerDisplayElement.textContent = "I should be there!";
    fullTimerDisplayElement.textContent = "";
    untilElement.textContent = `Now, ${chooseInArray(events)}`;

    clearInterval(updateTimerIntervalId);
  }
  else {
    const timeInterval = new TimeInterval(new Date(), LANDING_DATE);

    timeIntervalStrings = timeInterval.toStrings();

    if (timeIntervalStrings.length > 0) {
      timerDisplayElement.textContent = arrayWordsToString(timeIntervalStrings);
    }
    else {
      timerDisplayElement.textContent = "??? time"
    }

    fulTimeIntervalStrings = timeInterval.toFullStrings();

    if (fulTimeIntervalStrings.length > 0) {
      fullTimerDisplayElement.textContent =
        `(or ${arrayWordsToString(fulTimeIntervalStrings, lastSeparator = " or ")} total)`;
    }
    else {
      fullTimerDisplayElement.textContent = "";
    }

  }
}

/**
 * 
 * @param {string} word 
 * @param {number} amount 
 */
function getPlural(word, amount) {
  if (amount != 1) {
    return `${word}s`;
  }
  else {
    return word;
  }
}

/**
 * 
 * @param {string[]} words 
 * @param {string} lastSeparator 
 */
function arrayWordsToString(words, lastSeparator = " and ") {
  const lastSeparatorIndex = words.length - 1;
  return words.reduce(
    (result, word, i) => {
      if (i === lastSeparatorIndex) {
        return result + lastSeparator + word;
      }
      else {
        return result + ", " + word;
      }
    },
  );
}

class TimeInterval {
  /**
   * @type {number}
   */
  #days;
  /**
   * @type {number}
   */
  #hours;
  /**
   * @type {number}
   */
  #minutes;
  /**
   * @type {number}
   */
  #seconds;
  /**
   * @type {number}
   */
  #milliseconds;
  /**
   * @type {number}
   */
  #fullMilliseconds;

  /**
   * 
   * @param {Date} from 
   * @param {Date} to 
   */
  constructor(from, to) {
    let millisecondsBetween = Math.max(to.getTime() - from.getTime());

    this.#fullMilliseconds = millisecondsBetween;

    this.#milliseconds = millisecondsBetween % SECOND_MILLI;
    millisecondsBetween -= this.#milliseconds;

    this.#seconds = (millisecondsBetween % MINUTE_MILLI) / SECOND_MILLI;
    millisecondsBetween -= this.#seconds * SECOND_MILLI;

    this.#minutes = (millisecondsBetween % HOUR_MILLI) / MINUTE_MILLI;
    millisecondsBetween -= this.#minutes * MINUTE_MILLI;

    this.#hours = (millisecondsBetween % DAY_MILLI) / HOUR_MILLI;
    millisecondsBetween -= this.#hours * HOUR_MILLI;

    this.#days = millisecondsBetween / DAY_MILLI;
  }

  get precision() {
    if (this.days >= 7) {
      return "week";
    }
    else if (this.days > 0) {
      return "day";
    }
    else if (this.hours > 0) {
      return "hour";
    }
    else if (this.minutes > 0) {
      return "minute";
    }
    else if (this.seconds > 0) {
      return "second";
    }
    else {
      return "millisecond";
    }
  }

  toStrings() {
    if (this.precision == "millisecond") {
      const unit = getPlural("millisecond", this.milliseconds);
      return [`${this.millisecondString} ${unit}`];
    }
    else if (this.precision == "second") {
      const unit1 = getPlural("second", this.seconds);
      const unit2 = getPlural("millisecond", this.milliseconds);
      return [`${this.seconds} ${unit1}`, `${this.millisecondString} ${unit2}`];
    }
    else if (this.precision == "minute") {
      const unit1 = getPlural("minute", this.minutes);
      const unit2 = getPlural("second", this.seconds);
      const unit3 = getPlural("millisecond", this.milliseconds);
      return [`${this.minutes} ${unit1}`, `${this.seconds} ${unit2}`, `${this.millisecondString} ${unit3}`];
    }
    else if (this.precision == "hour") {
      const unit1 = getPlural("hour", this.hours);
      const unit2 = getPlural("minute", this.minutes);
      const unit3 = getPlural("second", this.seconds);
      return [`${this.hours} ${unit1}`, `${this.minutes} ${unit2}`, `${this.seconds} ${unit3}`];
    }
    else if (this.precision == "day") {
      const unit1 = getPlural("day", this.days);
      const unit2 = getPlural("hour", this.hours);
      const unit3 = getPlural("minute", this.minutes);
      return [`${this.days} ${unit1}`, `${this.hours} ${unit2}`, `${this.minutes} ${unit3}`];
    }
    else if (this.precision == "week") {
      const unit1 = getPlural("day", this.days);
      const unit2 = getPlural("hour", this.hours);
      return [`${this.days} ${unit1}`, `${this.hours} ${unit2}`];
    }
    else {
      return [];
    }
  }

  toFullStrings() {
    if (this.precision == "minute" || this.precision == "hour") {
      const unit = getPlural("millisecond", this.fullMilliseconds);
      return [`${this.fullMilliseconds} ${unit}`];
    }
    else if (this.precision == "day") {
      const unit = getPlural("minute", this.fullMinutes);
      return [`${this.fullMinutes} ${unit}`];
    }
    else if (this.precision == "week") {
      const unit = getPlural("hour", this.fullHours);
      return [`${this.fullHours} ${unit}`];
    }
    else {
      return [];
    }
  }

  get days() {
    return this.#days;
  }

  get dayString() {
    return this.days.toString().padStart(2, "0");
  }

  get fullDays() {
    return (Math.floor(this.#fullMilliseconds / DAY_MILLI))
      .toLocaleString("en");
  }

  get hours() {
    return this.#hours;
  }

  get hourString() {
    return this.hours.toString().padStart(2, "0");
  }

  get fullHours() {
    return (Math.floor(this.#fullMilliseconds / HOUR_MILLI))
      .toLocaleString("en");
  }

  get minutes() {
    return this.#minutes;
  }

  get minuteString() {
    return this.minutes.toString().padStart(2, "0");
  }

  get fullMinutes() {
    return (Math.floor(this.#fullMilliseconds / MINUTE_MILLI))
      .toLocaleString("en");
  }

  get seconds() {
    return this.#seconds;
  }

  get secondString() {
    return this.seconds.toString().padStart(2, "0");
  }

  get fullSeconds() {
    return (Math.floor(this.#fullMilliseconds / SECOND_MILLI))
      .toLocaleString("en");
  }

  get milliseconds() {
    return this.#milliseconds;
  }

  get millisecondString() {
    return this.milliseconds.toString().padStart(3, "0");
  }

  get fullMilliseconds() {
    return this.#fullMilliseconds.toLocaleString("en");
  }
}
