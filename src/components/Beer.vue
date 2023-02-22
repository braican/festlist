<template>
  <div
    class="beer"
    :class="{
      'rated-positive': rating > 0,
      'rated-negative': rating < 0,
      'rated-neutral': rating === 0,
      expanded: expanded,
      saved: saved,
    }"
  >
    <div class="placard">
      <div>
        <button @click="expanded = !expanded" class="more-button">
          <p class="beer-name">
            <strong>{{ beer.name }}</strong>
          </p>

          <p class="beer-style">
            {{ beer.style }}
          </p>
          <p class="beer-abv">{{ beer.abv }}% ABV</p>
        </button>
        <transition name="more">
          <div v-show="expanded" class="beer-more">
            <p class="beer-notes">
              {{ beer.notes }}
            </p>
            <p v-if="beer.location">
              <span class="label">Find it:</span> Table {{ beer.location }}
            </p>
          </div>
        </transition>
      </div>

      <div v-show="currentUser" class="beer-rating">
        <button
          class="thumb-rating thumbs-down"
          :class="{ active: rating < 0 }"
          @click="rateBeer(-1)"
        >
          <ThumbsDownIcon />
        </button>
        <button
          class="thumb-rating thumbs-neutral"
          :class="{ active: rating === 0 }"
          @click="rateBeer(0)"
        >
          <ThumbNeutralIcon />
        </button>
        <button class="thumb-rating thumbs-up" :class="{ active: rating > 0 }" @click="rateBeer(1)">
          <ThumbsUpIcon />
        </button>
      </div>

      <div v-show="currentUser" class="beer-save">
        <button class="save-btn" :class="{ active: saved }" @click="saveBeer">
          <span class="icon"><StarIcon /></span>
          <!-- <span class="label">{{ saved ? 'Unsave' : 'Save' }}</span> -->
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { usersCollection } from '@/firebase';
import { logError } from '@/util/loggers';
import { mapState } from 'vuex';
import ThumbsUpIcon from '@/svg/thumbs-up';
import ThumbsDownIcon from '@/svg/thumbs-down';
import ThumbNeutralIcon from '@/svg/thumbs-neutral';
import StarIcon from '@/svg/star';

export default {
  name: 'Beer',
  components: { ThumbsUpIcon, ThumbsDownIcon, ThumbNeutralIcon, StarIcon },
  props: {
    beer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      saved: false,
      rating: null,
      expanded: false,
    };
  },
  computed: {
    ...mapState(['currentUser']),
  },
  created() {
    if (!this.currentUser) {
      return;
    }

    this.beerRef = usersCollection
      .doc(this.currentUser.uid)
      .collection('fests')
      .doc(this.$route.params.id)
      .collection('beers')
      .doc(this.beer.id);

    this.beerRef.get().then(snapshot => {
      if (!snapshot.exists) {
        return;
      }

      const { saved, rating } = snapshot.data();

      if (saved) {
        this.saved = saved;
      }

      if (rating) {
        this.rating = rating;
      }
    });
  },
  methods: {
    saveBeer() {
      this.saved = !this.saved;

      if (!this.beerRef) {
        return;
      }

      this.beerRef.set({ saved: this.saved }, { merge: true }).catch(logError);
    },
    rateBeer(rating) {
      this.rating = this.rating === rating ? null : rating;

      if (!this.beerRef) {
        return;
      }

      this.beerRef.set({ rating: this.rating }, { merge: true }).catch(logError);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

.label {
  @include label();
}

.beer {
  position: relative;
  padding: 1rem 1rem 1rem 0.5rem;
  background-color: $c--white;
  border-top: 1px solid $c--gray-e;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 1em;
  }
  &.rated-positive:after {
    border-right-color: $c--teal;
    border-top-color: $c--teal;
  }

  &.rated-negative:after {
    border-right-color: $c--red;
    border-top-color: $c--red;
  }
  &.rated-neutral:after {
    border-right-color: $c--yellow-desat;
    border-top-color: $c--yellow-desat;
  }

  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-left: 4px solid transparent;
  }

  &.saved:before {
    border-color: $c--yellow;
  }
}

.placard {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: flex-start;
}

.beer-rating {
  grid-column: 2;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
}

.beer-name {
  color: $c--gray-4;
}

.beer-save {
  order: -1;
  width: 44px;
  padding: 8px;

  .save-btn {
    width: 100%;
    display: block;

    svg {
      width: 100%;
    }
  }
}

.more-button {
  text-align: left;
}

.beer-style,
.beer-abv {
  font-size: $fs--sm;
}

.beer-style {
  font-style: italic;
}

.thumb-rating {
  width: 44px;
  height: 44px;
  padding: 10px;
  border-radius: 50%;
  border: 1px solid $c--gray-e;

  &:focus {
    outline: none;
  }

  svg {
    width: 100%;
    display: block;
    fill: $c--gray-9;
  }

  &.active svg {
    fill: $c--white;
  }

  &.thumbs-up.active {
    border-color: $c--teal;
    background-color: $c--teal;
  }

  &.thumbs-neutral.active {
    border-color: $c--yellow-desat;
    background-color: $c--yellow-desat;
  }

  &.thumbs-down.active {
    border-color: $c--red;
    background-color: $c--red;
  }
}

.beer-more {
  margin-top: 1rem;
  display: none;

  .expanded & {
    display: block;
  }
}

.beer-notes {
  font-size: 0.86rem;
}

.more-actions {
  text-align: center;
}

.save-btn {
  &:focus {
    outline: none;
  }

  svg {
    margin: auto;
    display: block;
    width: 24px;
    fill: none;
    stroke: $c--gray-9;
  }

  &.active svg {
    fill: $c--yellow;
    stroke: $c--yellow;
  }
}

// Animation
.more-enter-active,
.more-leave-active {
  @include transition(opacity);
}

.more-leave-to {
  transition-duration: 0s;
}

.more-enter,
.more-leave-to {
  opacity: 0;
}
</style>
