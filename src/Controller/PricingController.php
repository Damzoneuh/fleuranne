<?php

namespace App\Controller;

use App\Entity\CareType;
use App\Entity\Img;
use App\Entity\Mark;
use App\Helper\FileHelper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PricingController extends AbstractController
{
    use FileHelper;
    /**
     * @Route("/pricing", name="pricing")
     */
    public function index()
    {
        return $this->render('pricing/index.html.twig', [
            'controller_name' => 'PricingController',
        ]);
    }

    /**
     * @return Response
     * @Route("/admin/pricing", name="admin_pricing")
     */
    public function adminPricing(){
       return $this->render('admin/pricing.html.twig');
    }

    /**
     * @Route("/admin/api/care/{id}", name="admin_api_get_care", methods={"GET"})
     * @param null $id
     * @return JsonResponse
     */
    public function getCare($id = null){
        if ($id){
            return $this->json($this->getDoctrine()->getRepository(CareType::class)->find($id));
        }
        return $this->json($this->getDoctrine()->getRepository(CareType::class)->findAll());
    }

    /**
     * @return JsonResponse
     * @Route("/admin/api/mark", name="admin_api_get_mark", methods={"GET"})
     */
    public function getMarks(){
        return $this->json($this->getDoctrine()->getRepository(Mark::class)->findAll());
    }

    /**
     * @param $id
     * @return JsonResponse
     * @Route("/admin/api/delete/mark/{id}", name="admin_api_delete_mark", methods={"DELETE"})
     */
    public function deleteMark($id){
        $em = $this->getDoctrine()->getManager();
        $mark = $this->getDoctrine()->getRepository(Mark::class)->find($id);
        $img = $this->getDoctrine()->getRepository(Img::class)->find($mark->getImg()->getId());
        $this->removeFile($img->getPath());
        $em->remove($mark);
        $em->remove($img);
        $em->flush();

        return $this->json(['success' => 'L\'image à bien été supprimée']);
    }
}
