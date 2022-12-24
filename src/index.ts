import { connect } from './connection';

connect().then(async socket => {
    const { getLabels } = socket;
    console.log(await getLabels);
})