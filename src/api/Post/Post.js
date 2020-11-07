import { prisma } from '../../../generated/prisma-client';

export default {
	Post: {
		files: ({ id }) => prisma.post({ id }).files(),
		comments: ({ id }) => prisma.post({ id }).comments(),
		user: ({ id }) => prisma.post({ id }).user(),
		isLiked: (parent, _, { request }) => {
			const { user } = request;
			const { id: postId } = parent;
			try {
				return prisma.$exists.like({
					AND: [{ user: { id: user.id } }, { post: { id: postId } }]
				});
			} catch (error) {
				console.log(error);
				return false;
			}
		},
		likeCount: (parent) =>
			prisma
				.likesConnection({
					where: { post: { id: parent.id } }
				})
				.aggregate()
				.count()
	}
};
