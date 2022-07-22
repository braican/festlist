<template>
  <div
    class="beer"
    :class="{
      'rated-positive': rating > 0,
      'rated-negative': rating < 0,
      expanded: expanded,
      saved: saved && rating === 0,
    }"
  >
    <div class="placard">
      <button @click="expanded = !expanded" class="more-button">
        <p class="beer-name">
          <strong>{{ beer.name }}</strong>
        </p>

        <p class="beer-style">
          {{ beer.style }}
        </p>
        <p class="beer-abv">{{ beer.abv }}% ABV</p>
      </button>

      <div v-show="currentUser" class="beer-action">
        <div>
          <button
            class="thumb-rating thumbs-up"
            :class="{ active: rating > 0 }"
            @click="rateBeer(1)"
          >
            <ThumbsUpIcon />
          </button>
          <button
            class="thumb-rating thumbs-down"
            :class="{ active: rating < 0 }"
            @click="rateBeer(-1)"
          >
            <ThumbsDownIcon />
          </button>
        </div>
        <button class="save-btn" :class="{ active: saved }" @click="saveBeer">
          <span class="icon"><StarIcon /></span>
          <span class="label">{{ saved ? 'Unsave' : 'Save' }}</span>
        </button>
      </div>
    </div>

    <transition name="more">
      <div v-show="expanded" class="beer-more">
        <p class="beer-notes">
          {{ beer.notes }}
        </p>
        <p v-if="beer.location"><span class="label">Find it:</span> Table {{ beer.location }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { usersCollection } from '@/firebase';
import { logError } from '@/util/loggers';
import { mapState } from 'vuex';
import ThumbsUpIcon from '@/svg/thumbs-up';
import ThumbsDownIcon from '@/svg/thumbs-down';
import StarIcon from '@/svg/star';

export default {
  name: 'Beer',
  components: { ThumbsUpIcon, ThumbsDownIcon, StarIcon },
  props: {
    beer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      saved: false,
      rating: 0,
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
      this.rating = this.rating === rating ? 0 : rating;

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
  padding: 1rem;
  margin-top: 1rem;
  box-shadow: 0 0 12px -5px rgba($c--black, 0.2);
  border: 1px solid rgba($c--black, 0.05);
  background-color: $c--white;

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
  &.saved:after {
    border-right-color: $c--yellow;
    border-top-color: $c--yellow;
  }

  &.expanded {
    border: 1px solid rgba($c--teal, 0.1);
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-left: 4px solid $c--teal;
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

  &:focus {
    outline: none;
  }

  svg {
    width: 100%;
    display: block;
    fill: none;
    stroke: $c--gray-9;
    stroke-width: 1;
  }

  &.thumbs-up.active svg {
    fill: $c--teal;
    stroke: $c--teal;
  }

  &.thumbs-down.active svg {
    fill: $c--red;
    stroke: $c--red;
  }
}

.beer-action {
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
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
