// TODO: Implement config handler for yamls
//       - [ ] Let it refetch
//       - [ ] fetchConfig for hot reloads

// Minimum number of annotations for an image
const MIN_ANNOTATIONS = 1
// Maximum number of annotations for an image
const MAX_ANNOTATIONS = 5
// If delta in minutes is less, than redirect to qualityfail link
const QUALITYFAIL_DELTA = 10 // TODO: Implement
// percentage between public and private images
const IMAGE_DISTRIBUTION = 0.5
// maximum submissions of a user before a redirect is done
const MAX_SUBMISSIONS = 60

export {
    MIN_ANNOTATIONS,
    MAX_ANNOTATIONS,
    IMAGE_DISTRIBUTION,
    QUALITYFAIL_DELTA,
    MAX_SUBMISSIONS
}