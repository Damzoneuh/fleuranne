<?php

namespace App\Controller;

use App\Entity\Img;
use App\Entity\News;
use App\Helper\FileHelper;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    use FileHelper;
    /**
     * @Route("/admin", name="admin")
     */
    public function index()
    {
        return $this->render('admin/index.html.twig');
    }

    /**
     * @return Response
     * @Route("/admin/news", name="admin_news")
     * @throws Exception
     */
    public function News(Request $request){
        $form = $this->createFormBuilder()
            ->add('title', TextType::class, [
                'label' => 'Titre'
            ])
            ->add('file', FileType::class, [
                'label' => 'Image'
            ])
            ->add('text', TextareaType::class, [
                'label' => 'Texte'
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Valider',
                'attr' => [
                    'class' => 'btn btn-group btn-grey'
                ]
            ])
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()){
            $data = $form->getData();
            $em = $this->getDoctrine()->getManager();

            $news = new News();
            $news->setTitle($data['title']);
            $news->setText($data['text']);
            if ($data['file']){
                try {
                    /** @var UploadedFile $file */
                    $file = $data['file'];
                    $fileName = $this->generateFileName() . '.' . $file->getClientOriginalExtension();
                    $path = $this->getParameter('storage') . '/' . $fileName;
                    $img = new Img();
                    $img->setName($file->getClientOriginalName());
                    $img->setPath($path);

                    $em->persist($img);
                    $this->moveFile($file, $this->getParameter('storage'), $fileName);
                    $news->setImg($img);
                }
                catch (Exception $exception){
                    $this->addFlash('error', 'Une erreur est survenue si le problème persiste contacter un administrateur');
                    return $this->redirectToRoute('admin_news');
                }
            }
            try {
                $em->persist($news);
                $em->flush();
            }
            catch (Exception $exception){
                $this->addFlash('error', 'Une erreur est survenue si le problème persiste contacter un administrateur');
                return $this->redirectToRoute('admin_news');
            }
            $this->addFlash('success', 'L\'actualité à bien été publiée');

            return $this->redirectToRoute('admin_news');
        }
        return $this->render('news/admin.html.twig', [
            'news' => $this->getDoctrine()->getRepository(News::class)->findAll(),
            'form' => $form->createView()
        ]);
    }

    /**
     * @param Request $request
     * @param $id
     * @return Response
     * @Route("/admin/edit/{id}/news", name="admin_edit_news")
     */
    public function editNews(Request $request, $id){
        $em = $this->getDoctrine()->getManager();
        $news = $em->getRepository(News::class)->find($id);

        $form = $this->createFormBuilder()
            ->add('title', TextType::class, [
                'label' => 'Titre',
                'data' => $news->getTitle()
            ])
            ->add('text', TextareaType::class, [
                'label' => 'Texte',
                'data' => $news->getText()
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Valider',
                'attr' => [
                    'class' => 'btn btn-group btn-grey'
                ]
            ])
            ->getForm();

        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid()){
            try {
                $data = $form->getData();
                $news->setText($data['text']);
                $news->setTitle($data['title']);
                $em->flush();
            }
            catch (Exception $exception){
                $this->addFlash('error', 'Une erreur est survenue lors de l\'édition si le problème persiste contacter un administrateur');
            }

            $this->addFlash('success', 'L\'actualité à bien été modifiée');
            return $this->redirectToRoute('admin_news');
        }
        return $this->render('news/admin-edit.html.twig', [
            'form' => $form->createView(),
            'news' => $news
        ]);
    }

    /**
     * @param $id
     * @return RedirectResponse
     * @Route("/admin/delete/{id}/news", name="admin_delete_news")
     */
    public function deleteNews($id){
        $em = $this->getDoctrine()->getManager();
        $news = $em->getRepository(News::class)->find($id);
        if ($news->getImg()){
            $this->removeFile($news->getImg()->getPath());
            $em->remove($news->getImg());
        }
        $em->remove($news);
        $em->flush();
        $this->addFlash('success', 'La publication à bien été supprimée');
        return $this->redirectToRoute('admin_news');
    }

    public function pricing(){
        return $this->render('admin/pricing.html.twig');
    }
}
